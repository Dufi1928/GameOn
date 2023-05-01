# Generated by Django 4.2 on 2023-05-01 21:43

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('description', models.TextField()),
                ('note', models.FloatField()),
                ('likes', models.IntegerField()),
                ('photos', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), default=list, size=None)),
                ('icon', models.CharField(max_length=255)),
                ('category', models.ManyToManyField(to='games.category')),
            ],
        ),
    ]
