from django.shortcuts import render
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.contrib.auth.models import User
from django.template import loader
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.views import login as auth_login_view
from django.template import RequestContext
# Import smtplib for the actual sending function
import smtplib
# Import the email moldules we'll need
from email.mime.text import MIMEText
# Used for date
from datetime import datetime
from .models import  subscribed_emails
import re
# Needed/utilized for reCaptcha
import json
import urllib
import urllib2
import utilities


def tmpSignInRegister(request):
    template = loader.get_template('ludega_brokerage/tmpSignInRegister.html')
    context = {
        'registerNotSignIn': True,
        'FormAction': '/accounts/register/',
        'FormMethod': 'post',
    }
    return HttpResponse(template.render(context, request))


def login(request):
    template = loader.get_template('ludega_brokerage/signinRegister.html')
    context = RequestContext(request, {
        'registerNotSignIn': True,
        'FormAction': '/accounts/register/',
        'FormMethod': 'post',
    })
    return HttpResponse(template.render(context, request))
    #return auth_login_view(request)


# For duel dev purposes only
def index(request):
    #if request.user.is_authenticated:
        # Do something for authenticated users.
    #else:
        # Do something for anonymous users.
    return render(request, 'ludega_brokerage/index.html')


def index2(request):
    #if request.user.is_authenticated:
        # Do something for authenticated users.
    #else:
        # Do something for anonymous users.
    return render(request, 'ludega_brokerage/index2.html')

def privacy(request):
    return render(request,'ludega_brokerage/privacy.html')


def cryptocurrency_exchange_summary(request, exchange):

    template = loader.get_template('ludega_brokerage/cryptocurrency-exchange-summary.html')
    exchg_info_json_str = utilities.get_exchange_info(exchange)
    exchg_info_json = json.loads(exchg_info_json_str)
    context = {

            'jsonData': exchg_info_json,
        'jsonDataStr': exchg_info_json_str


    }
    return HttpResponse(template.render(context, request))

def cryptocurrency_coin_summary(request, currency):

    template = loader.get_template('ludega_brokerage/cryptocurrency-coin-summary.html')
    coin_info_json_str = utilities.get_coin_info(currency)
    coin_info_json = json.loads(coin_info_json_str)
    context = {

        'jsonData': coin_info_json,
        'jsonDataStr': coin_info_json_str

    }
    return HttpResponse(template.render(context, request))

#def registration_register(request):
#    return render(request, 'ludega_brokerage/registration.html')


def registerPage(request):
    template = loader.get_template('ludega_brokerage/signinRegister.html')
    context = {
        'registerNotSignIn': True,
        'FormAction': '/accounts/register/',
        'FormMethod': 'post',
    }
    return HttpResponse(template.render(context, request))
    # Old (before having context)
    #return render(request, 'ludega_brokerage/signinRegister.html')


def signInPage(request):
    template = loader.get_template('ludega_brokerage/signinRegister.html')
    context = {
        'registerNotSignIn': False,
        'FormAction': '/accounts/login/',
        'FormMethod': 'post',
    }
    return HttpResponse(template.render(context, request))
    # Old (before having context)
    #return render(request, 'ludega_brokerage/signinRegister.html')


# Register new users
#def register_user(request):
#    user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')

# Change User's Password
#def change_user_password(request):
#   u = User.objects.get(username='john')
#   u.set_password('new password')
#   u.save()


# Authenticate/Login User
def logon_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
    else:
        # Return an 'invalid login' error message.
        return render(request, 'ludega_brokerage/registration.html')


def logout_user(request):
    logout(request)
    # Redirect to a success page.
    return render(request, 'ludega_brokerage/index.html')

def coming_soon(request):
    logout(request)
    # Redirect to a success page.
    return render(request, 'ludega_brokerage/comingSoon.html')



#Example on limiting "access" if the user is not logged in.
#def my_view(request):
#    if not request.user.is_authenticated:
#        return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))

def contact_form_submit(request):
    # Gather the data that's needed to validate the reCaptcha
    ip = request.POST['user_ip']
    captcha = request.POST['captcha']

    # Make POST request to Google checking if the user is a robot.
    url = 'https://www.google.com/recaptcha/api/siteverify'
    values = {'secret': '6LfE2EcUAAAAAPRDw3F6iPw2y1nVwqG3Ejseu9TP',
              'response': captcha}
    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    data = response.read()

    # If Google's response (to above post request) contains "  "success": true", then go on to send the email.
    # Otherwise return failure
    data_json = json.loads(data)
    if data_json["success"] == True:

        # Build body of the email
        body = "CONTACT FORM SUBMITTED ON \"brokerage.ludega.com\"\n\n"
        body += "Name: " + request.POST['first_name'] + request.POST['last_name'] + "\n"
        body += "Email: " + request.POST['email'] + "\n"
        body += "Message: " + request.POST['message'] + "\n"

        # Create email MIMEText object and fill headers
        email = MIMEText(body)
        email['Subject'] = '[' + datetime.now().strftime("%I:%M%p on %B %d, %Y") + '] [Ludega Brokerage] CONTACT FORM SUBMITTED'
        email['From'] = 'ludega.bot@ludega.com'
        email['To'] = 'ludega.team@ludega.com'

        # Send the email via Google's SMTP server, but don't include the envelope header.
        s = smtplib.SMTP('smtp.gmail.com', 587)
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login('bot.ludega@gmail.com', 'Summ69.+123#@!')
        s.sendmail('bot.ludega@gmail.com', 'alex.woody@ludega.com', email.as_string())#'brokerage.team@ludega.com', email.as_string())
        s.quit()

        return HttpResponseRedirect(reverse('index'))

    else:
        return HttpResponse("{\"success\":false,\"message\":\"Google reCaptcha failed.\"}")

def subscribe_email(request):
    # Begin by getting the email from the request and determining if it's even a valid format.
    email_address_frm_req = request.POST['email_address']

    if re.match("^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", email_address_frm_req):
        # Then it's ok to add it to the database
        conforming_email_address = subscribed_emails(email_address=email_address_frm_req)
        conforming_email_address.save()

        # Return success to user
        return HttpResponse("You successfully subscribed!")
    else:
        # Return false to user
        return HttpResponse("That email does not appear to be valid.")


