from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from random import randint
from django.core.mail import send_mail, EmailMessage
from io import BytesIO
from django.db import transaction
from django.conf import settings
from django.db import connection
from datetime import datetime, date, timedelta

# import requests
from decimal import Decimal
from num2words import num2words
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from .models import *
from openpyxl import load_workbook, Workbook
from openpyxl.styles import Font, Protection, Alignment
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import json
from rest_framework.decorators import api_view, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from .serializers import *


# Create your views here.


def home(request):
    return HttpResponse("Okay")


@api_view(("POST",))
def registerTrialUser(request):
    try:
        usrnm = request.data["username"]
        eml = request.data["email"]
        phn = request.data["phone_number"]
        cmpny = request.data["company_name"]
        pswrd = request.data["password"]
        cpswrd = request.data["confirm_password"]

        if User.objects.filter(username=usrnm).exists():
            return Response(
                {
                    "status": False,
                    "message": "This username already exists. Try another..",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif User.objects.filter(email=eml).exists():
            return Response(
                {
                    "status": False,
                    "message": "Email already exists. Try another..",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif Company.objects.filter(phone_number=phn).exists():
            return Response(
                {
                    "status": False,
                    "message": "Phone number already exists. Try another..",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif Company.objects.filter(company_name__iexact=cmpny.lower()).exists():
            return Response(
                {
                    "status": False,
                    "message": "Company Name already exists. Try another..",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            if pswrd == cpswrd:
                userInfo = User.objects.create_user(
                    username=usrnm,
                    email=eml,
                    password=pswrd,
                )
                userInfo.save()
                # cData = User.objects.get(id=userInfo.id)
                request.data["user"] = userInfo.id
                serializer = CompanySerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    cmp = Company.objects.get(cmp_id=serializer.data["cmp_id"])

                    # storing trial data
                    start = date.today()
                    end = start + timedelta(days=30)
                    trial = ClientTrials(
                        user=userInfo,
                        company=cmp,
                        start_date=start,
                        end_date=end,
                        trial_status=True,
                        purchase_start_date=None,
                        purchase_end_date=None,
                        purchase_status="null",
                        payment_term=None,
                        subscribe_status="null",
                    )
                    trial.save()

                    return Response(
                        {"status": True, "data": serializer.data},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"status": False, "data": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {
                        "status": False,
                        "message": "Password and confirm password does not match..",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def userLogin(request):
    try:
        uName = request.data["username"]
        password = request.data["password"]

        log_user = auth.authenticate(username=uName, password=password)
        if log_user is not None:
            user = User.objects.get(username=uName)
            if user.is_staff:
                auth.login(request, log_user)

                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "status": True,
                        "is_staff": True,
                        "user": str(user.id),
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "role": "Admin",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                refresh = RefreshToken.for_user(user)
                log_status = ClientTrials.objects.get(user=user.id)
                if log_status.purchase_status == "valid":
                    auth.login(request, user)
                    return Response(
                        {
                            "status": True,
                            "is_staff": False,
                            "user": str(user.id),
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                            "role": "User",
                        },
                        status=status.HTTP_200_OK,
                    )
                elif log_status.purchase_status == "expired":
                    return Response(
                        {
                            "status": False,
                            "message": "Your Subscription has been expired.! Contact Admin.",
                            "is_staff": False,
                            "user": str(user.id),
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        status=status.HTTP_200_OK,
                    )
                elif log_status.purchase_status == "cancelled":
                    return Response(
                        {
                            "status": False,
                            "message": "Your Subscription has been Cancelled.! Contact Admin.",
                            "is_staff": False,
                            "user": str(user.id),
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    if log_status.trial_status:
                        auth.login(request, user)
                        return Response(
                            {
                                "status": True,
                                "is_staff": False,
                                "user": str(user.id),
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                                "role": "User",
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "status": False,
                                "message": "Your Trial period has been expired.! Contact Admin.",
                                "is_staff": False,
                                "user": str(user.id),
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                            },
                            status=status.HTTP_200_OK,
                        )
        else:
            return Response(
                {"status": False, "message": "Invalid username or password, try again"},
                status=status.HTTP_404_NOT_FOUND,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def validateEmail(request):
    email = request.GET["email"]

    if User.objects.filter(email=email).exists():
        return JsonResponse({"is_taken": True})
    else:
        return JsonResponse({"is_taken": False})


@api_view(("GET",))
def validateUsername(request):
    uName = request.GET["user"]

    if User.objects.filter(username=uName).exists():
        return JsonResponse({"is_taken": True})
    else:
        return JsonResponse({"is_taken": False})


@api_view(("GET",))
def validatePhone(request):
    number = request.GET["phone"]

    if Company.objects.filter(phone_number=number).exists():
        return JsonResponse({"is_taken": True})
    else:
        return JsonResponse({"is_taken": False})


@api_view(("GET",))
def validateCompany(request):
    cmp = request.GET["company"]

    if Company.objects.filter(company_name__iexact=cmp.lower()).exists():
        return JsonResponse({"is_taken": True})
    else:
        return JsonResponse({"is_taken": False})


# Admin


@api_view(("GET",))
def fetchRegisteredClients(request):
    try:
        all_companies = Company.objects.all()
        clients = []
        for i in all_companies:
            if ClientTrials.objects.filter(company=i).exists():
                trial = ClientTrials.objects.filter(company=i).first()
            else:
                trial = None

            dict = {
                "user_id": i.user.id,
                "company_name": i.company_name,
                "email": i.user.email,
                "contact": i.phone_number,
                "gstin": i.gst_number,
                "start_date": trial.start_date if trial else "",
            }
            clients.append(dict)

        return Response(
            {"status": True, "clients": clients},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def deleteClient(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response(
            {"status": True},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def fetchPaymentTerms(request):
    try:
        terms = PaymentTerms.objects.all()
        termsSerializer = PaymentTermsSerializer(terms, many=True)
        return Response(
            {"status": True, "terms": termsSerializer.data},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def deletePaymentTerm(request, id):
    try:
        term = PaymentTerms.objects.get(id=id)
        term.delete()
        return Response(
            {"status": True},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def createNewPaymentTerm(request):
    try:
        dur = request.data["duration"]
        term = request.data["term"]
        dys = int(dur) if term == "Days" else int(dur) * 30
        request.data["days"] = dys

        # PaymentTerms.objects.create(duration=dur, term=term, days=dys)
        serializer = PaymentTermsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": True, "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def fetchDemoClients(request):
    try:
        d_clients = ClientTrials.objects.filter(
            Q(trial_status=True) | (Q(trial_status=False) & Q(subscribe_status="yes"))
        )
        clients = []
        for i in d_clients:

            dict = {
                "trial_id": i.id,
                "company_name": i.company.company_name,
                "email": i.user.email,
                "contact": i.company.phone_number,
                "gstin": i.company.gst_number,
                "end_date": i.end_date,
                "purchase_status": (
                    "Interested"
                    if i.subscribe_status == "yes"
                    else "Not Interested" if i.subscribe_status == "no" else "N/A"
                ),
            }
            clients.append(dict)

        return Response(
            {"status": True, "clients": clients},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def clientPurchase(request):
    try:
        client = ClientTrials.objects.get(id=request.data["id"])
        start = request.data["purchaseDate"]
        end = request.data["endDate"]
        term = PaymentTerms.objects.get(id=request.data["term"])

        client.purchase_start_date = start
        client.purchase_end_date = end
        client.payment_term = str(term.duration) + " " + term.term
        client.purchase_status = "valid"
        client.trial_status = False
        client.subscribe_status = "purchased"
        client.save()

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def fetchPurchasedClients(request):
    try:
        d_clients = ClientTrials.objects.exclude(purchase_status="null")
        clients = []
        for i in d_clients:

            dict = {
                "trial_id": i.id,
                "company_name": i.company.company_name,
                "email": i.user.email,
                "contact": i.company.phone_number,
                "gstin": i.company.gst_number,
                "start_date": i.purchase_start_date,
                "end_date": i.purchase_end_date,
                "payment_term": i.payment_term,
                "purchase_status": i.purchase_status,
            }
            clients.append(dict)

        return Response(
            {"status": True, "clients": clients},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def cancelSubscription(request):
    try:
        client = ClientTrials.objects.get(id=request.data["id"])
        client.purchase_status = "cancelled"
        client.save()

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# User


@api_view(("GET",))
def getSelfData(request, id):
    try:
        user = User.objects.get(id=id)
        img = None
        name = None
        if user:
            usrData = Company.objects.get(user=user)
            img = usrData.logo.url if usrData.logo else None
            name = usrData.company_name
        else:
            usrData = None
        details = {"name": name, "image": img}

        return Response({"status": True, "data": details})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getItemUnits(request, id):
    try:
        usr = User.objects.get(id=id)
        cmp = Company.objects.get(user=usr)

        units = Item_units.objects.filter(cid=cmp)
        serializer = UnitsSerializer(units, many=True)
        return Response(
            {"status": True, "units": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def createNewUnit(request):
    try:
        usr = User.objects.get(id=request.data["Id"])
        cmp = Company.objects.get(user=usr)
        sym = request.data["symbol"]
        name = request.data["name"]
        unit = Item_units(cid=cmp, symbol=sym, name=name)
        unit.save()
        return Response(
            {"status": True},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def checkItemBarcode(request):
    try:
        usr = User.objects.get(id=request.GET["Id"])
        cmp = Company.objects.get(user=usr)

        bc = request.GET["barcode"]
        if Items.objects.filter(cid=cmp, barcode=bc).exists():
            item = Items.objects.get(cid=cmp, barcode=bc)
            return Response(
                {
                    "status": False,
                    "message": f"Barcode is already associated with item - '{item.name}',\nTry again..",
                },
                status=status.HTTP_226_IM_USED,
            )
        else:
            return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def createNewItem(request):
    try:
        usr = User.objects.get(id=request.data["Id"])
        cmp = Company.objects.get(user=usr)
        request.data["cid"] = cmp.cmp_id

        bc = request.data["barcode"]
        if bc != "":
            bc = bc.upper()
        if bc != "" and Items.objects.filter(cid=cmp, barcode=bc).exists():
            return Response(
                {"status": False, "message": "Barcode already exists, try another.!"},
                status=status.HTTP_226_IM_USED,
            )
        tax = request.data["tax_reference"]
        request.data["tax"] = "Taxable" if tax else "Non-taxable"
        request.data["gst"] = "GST0[0%]" if not tax else request.data["gst"]
        request.data["igst"] = "IGST0[0%]" if not tax else request.data["igst"]

        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            item = Items.objects.get(id=serializer.data["id"])

            transaction = Item_transactions(
                cid=cmp,
                item=item,
                type="Opening Stock",
                date=item.date,
                quantity=item.stock,
            )
            transaction.save()

            return Response(
                {"status": True, "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getItems(request, id):
    try:
        usr = User.objects.get(id=id)
        cmp = Company.objects.get(user=usr)

        itms = Items.objects.filter(cid=cmp)
        iData = Items.objects.filter(cid=cmp).first()
        trans = Item_transactions.objects.filter(cid=cmp, item=iData).order_by("-id")

        serializer = ItemSerializer(itms, many=True)
        itemSerializer = ItemSerializer(iData)
        trnsSerializer = ItemTransSerializer(trans, many=True)
        return Response(
            {
                "status": True,
                "items": serializer.data,
                "firstItem": itemSerializer.data,
                "transactions": trnsSerializer.data,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getItemDetails(request):
    try:
        iData = Items.objects.get(id=request.GET["itemId"])
        trans = Item_transactions.objects.filter(item=iData).order_by("-id")

        trns = Item_transactions.objects.get(item=iData, type="Opening Stock")
        op_stock = trns.quantity

        itemSerializer = ItemSerializer(iData)
        trnsSerializer = ItemTransSerializer(trans, many=True)
        return Response(
            {
                "status": True,
                "firstItem": itemSerializer.data,
                "transactions": trnsSerializer.data,
                "op_stock": op_stock,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def updateStock(request):
    try:
        usr = User.objects.get(id=request.data["Id"])
        cmp = Company.objects.get(user=usr)

        item = Items.objects.get(cid=cmp, id=request.data["item_id"])
        adj = request.data["adjust"]
        if adj:
            item.stock += int(request.data["stock"])
            item.save()

            trns = Item_transactions(
                cid=cmp,
                item=item,
                type="Add Stock",
                date=request.data["date"],
                quantity=request.data["stock"],
            )
            trns.save()
        else:
            item.stock -= int(request.data["stock"])
            item.save()

            trns = Item_transactions(
                cid=cmp,
                item=item,
                type="Reduce Stock",
                date=request.data["date"],
                quantity=request.data["stock"],
            )
            trns.save()
        return Response(
            {"status": True},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getTransactionDetails(request, id):
    try:
        trans = Item_transactions.objects.get(id=id)
        trnsSerializer = ItemTransSerializer(trans)
        return Response(
            {
                "status": True,
                "transaction": trnsSerializer.data,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def deleteTransaction(request, id):
    try:
        trns = Item_transactions.objects.get(id=id)
        item = Items.objects.get(id=trns.item.id)
        if trns.type == "Add Stock":
            item.stock -= trns.quantity
        elif trns.type == "Reduce Stock":
            item.stock += trns.quantity

        item.save()
        trns.delete()
        return Response(
            {
                "status": True,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def updateTransaction(request):
    try:
        trns = Item_transactions.objects.get(id=request.data["trans_id"])
        item = Items.objects.get(id=trns.item.id)
        crQty = trns.quantity
        chQty = int(request.data["quantity"])
        diff = abs(crQty - chQty)

        type = request.data["type"]
        if str(type).lower() == "reduce stock" and chQty > crQty:
            item.stock -= diff
        elif str(type).lower() == "reduce stock" and chQty < crQty:
            item.stock += diff
        elif str(type).lower() == "add stock" and chQty > crQty:
            item.stock += diff
        elif str(type).lower() == "add stock" and chQty < crQty:
            item.stock -= diff

        if str(type).lower() == "opening stock" and chQty > crQty:
            item.stock += diff
        elif str(type).lower() == "opening stock" and chQty < crQty:
            item.stock -= diff

        trns.quantity = request.data["quantity"]
        trns.date = request.data["date"]
        trns.save()
        item.save()

        return Response(
            {"status": True},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def deleteItem(request, id):
    try:
        item = Items.objects.get(id=id)

        if (
            Sales_items.objects.filter(item=item).exists()
            or Purchase_items.objects.filter(item=item).exists()
        ):
            return Response(
                {
                    "status": False,
                    "message": f"Item cannot be deleted because of Sales or Purchase transactions exists for `{item.name}`.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            item.delete()
            return Response(
                {
                    "status": True,
                },
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
def updateItem(request):
    try:
        usr = User.objects.get(id=request.data["Id"])
        cmp = Company.objects.get(user=usr)
        request.data["cid"] = cmp.cmp_id

        item = Items.objects.get(id=request.data["item_id"])
        trns = (
            Item_transactions.objects.filter(item=item.id)
            .filter(type="Opening Stock")
            .first()
        )
        crQty = trns.quantity
        chQty = int(request.data["stock"])
        diff = abs(crQty - chQty)

        if diff != 0 and chQty > crQty:
            request.data["stock"] = item.stock + diff
        elif diff != 0 and chQty < crQty:
            request.data["stock"] = item.stock - diff
        else:
            request.data["stock"] = item.stock

        bc = request.data["barcode"]
        if bc != "":
            bc = bc.upper()
        if (
            item.barcode != bc
            and bc != ""
            and Items.objects.filter(cid=cmp, barcode=bc).exists()
        ):
            return Response(
                {"status": False, "message": "Barcode already exists, try another.!"},
                status=status.HTTP_226_IM_USED,
            )
        tax = request.data["tax_reference"]
        request.data["tax"] = "Taxable" if tax else "Non-taxable"
        request.data["gst"] = "GST0[0%]" if not tax else request.data["gst"]
        request.data["igst"] = "IGST0[0%]" if not tax else request.data["igst"]

        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()

            trns.quantity = chQty
            trns.save()

            return Response(
                {"status": True, "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
