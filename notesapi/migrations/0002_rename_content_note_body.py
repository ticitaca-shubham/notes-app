# Generated by Django 4.0.2 on 2023-08-08 16:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notesapi', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='content',
            new_name='body',
        ),
    ]
