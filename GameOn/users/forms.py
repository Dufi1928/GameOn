from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from .models import NewUser
class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class': 'email','placeholder': 'Your Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'password','placeholder': 'Your Email'}))

class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-field','placeholder': 'Password'}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-field', 'placeholder': 'Confirm password'}),label='Confirm password')

    class Meta:
        model = NewUser
        fields = ['email', 'user_name', 'first_name', 'last_name', 'bio', 'age', 'avatar']
        widgets = {
            'email': forms.TextInput(attrs={'class': 'email','placeholder': 'Your Email'}),
            'user_name': forms.TextInput(attrs={'class': 'email', 'placeholder': 'Your pseudo'}),
            'first_name': forms.TextInput(attrs={'class': 'form-field','placeholder': 'Your name'}),
            'last_name': forms.TextInput(attrs={'class': 'form-field', 'placeholder': 'Your last name'}),
            'bio': forms.Textarea(attrs={'class': 'form-field', 'placeholder': 'Your bio'}),
            'age': forms.NumberInput(attrs={'class': 'form-field', 'placeholder': 'Your age'}),
            'avatar': forms.ClearableFileInput(attrs={'class': 'form-field'}),
        }

    def clean_password2(self):
        password = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('password2')
        if password and password2 and password != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user