from django.urls import path
from BillApp.views import *

urlpatterns = [
    path("", home),
    # path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("user_login/", userLogin),
    path("validate_email/", validateEmail),
    path("validate_username/", validateUsername),
    path("validate_phone_number/", validatePhone),
    path("validate_company_name/", validateCompany),
    path("register_trial_user/", registerTrialUser),
    # Admin
    path("get_registered_clients/", fetchRegisteredClients),
    path("delete_client/<int:id>/", deleteClient),
    path("get_payment_terms/", fetchPaymentTerms),
    path("delete_payment_term/<int:id>/", deletePaymentTerm),
    path("create_new_payment_term/", createNewPaymentTerm),
    path("get_demo_clients/", fetchDemoClients),
    path("client_purchase/", clientPurchase),
    path("get_purchased_clients/", fetchPurchasedClients),
    path("cancel_subscription/", cancelSubscription),
    # User
    path("user_details/<int:id>/", getSelfData),
    # Items
    path("get_item_units/<int:id>/", getItemUnits),
    path("create_new_unit/", createNewUnit),
    path("check_item_barcode/", checkItemBarcode),
    path("create_new_item/", createNewItem),
    path("update_stock/", updateStock),
    path("get_items/<int:id>/", getItems),
    path("get_item_details/", getItemDetails),
    path("get_transaction_details/<int:id>/", getTransactionDetails),
    path("delete_item_transaction/<int:id>/", deleteTransaction),
    path("update_transaction/", updateTransaction),
    path("delete_item/<int:id>/", deleteItem),
    path("update_item/", updateItem),
    # Sales
    path("fetch_sales_data/<int:id>/", fetchSalesData),
    path('get_item_data/', getItemData),
    path('get_barcode_details/',getBarcodeDetails),
    path('create_sales/', createSales),
    path("get_sales_bills/<int:id>/", getSalesBills),
    path("get_sales_bills_filtered/", getSalesBillsFiltered),
    path("get_sale_bill_details/", getSalesBillDetails),
    path("delete_sales_bill/<int:id>/", deleteSalesBill),
]
