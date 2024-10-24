from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from BillApp.models import *


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["user_is_staff"] = user.is_staff

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class TrialSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = ClientTrials
        fields = "__all__"


class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerms
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = "__all__"


class UnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_units
        fields = "__all__"


class ItemTransSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_transactions
        fields = "__all__"


class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = "__all__"


class SalesItemsSerializer(serializers.ModelSerializer):
    sid = SalesSerializer()
    item = ItemSerializer()

    class Meta:
        model = Sales_items
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchases
        fields = "__all__"


class PurchaseItemsSerializer(serializers.ModelSerializer):
    pid = SalesSerializer()
    item = ItemSerializer()

    class Meta:
        model = Purchase_items
        fields = "__all__"
