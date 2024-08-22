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
