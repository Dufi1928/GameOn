# Generated by Django 4.2.1 on 2023-06-08 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guides', '0002_gameguide_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameguide',
            name='title',
            field=models.CharField(default='', max_length=255),
        ),
    ]
