from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages

from .models import Photo
from .forms import PhotoForm

class PhotoView(View):
	def get(self, request):
		photos = Photo.objects.all()
		form = PhotoForm
		context = {
			'photos': photos,
			'form': form
		}
		return render(request, 'photo_form.html', context)

	def post(self, request):
		form = PhotoForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			messages.success(request, "A imagem foi salva")
			return redirect('index')
		else:
			messages.error(request, "Corrija os seguintes erros")
			return redirect('photos')
