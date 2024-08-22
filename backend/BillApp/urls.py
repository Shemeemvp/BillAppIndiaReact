from django.urls import path
from BillApp.views import *

urlpatterns = [
    path("", home),
    # path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("user_login/", userLogin),
    path('validate_email/',validateEmail),
    path('validate_username/',validateUsername),
    path('validate_phone_number/',validatePhone),
    path('validate_company_name/',validateCompany),
    path('register_trial_user/',registerTrialUser),

    # Admin
    path('get_registered_clients/', fetchRegisteredClients),
    path('delete_client/<int:id>/', deleteClient),
    path('get_payment_terms/', fetchPaymentTerms),
    path('delete_payment_term/<int:id>/', deletePaymentTerm),
    path('create_new_payment_term/', createNewPaymentTerm),
]
