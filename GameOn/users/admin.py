from django.contrib import admin
from .models import NewUser
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea

class UserAdminConfig(UserAdmin):
    ordering = ('-start_date',)
    search_fields = ('email','ueser_name', 'first_name', 'last_name',)
    list_filters = ('email', 'user_name', 'first_name', 'is_active', 'is_staff')
    list_display = ('email', 'user_name', 'first_name', 'is_active', 'is_staff')
    fieldsets=(
        (None, {'fields': ('first_name', 'last_name','user_name','email',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active',)}),
        ('Personal',{'fields': ('bio',)}),
    )
    formfield_override ={
        NewUser.bio:{'widget': Textarea(attrs={'rows':10 , 'cols':40})}
    }
    add_fieldsets = (
        (None, {
            'classes':('wide',),
            'fields':('email', 'password1', 'password2','first_name', 'last_name','user_name'),
        })
    )
admin.site.register(NewUser, UserAdminConfig)

