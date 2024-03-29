from .models import Note
from .serializers import NoteSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pickle
with open('C:/Users/ticitaca_shubham/Desktop/Saas-apps/notes-app/notesapi/notelabel_model.pkl', 'rb') as file:
        model = pickle.load(file)

# print(model.predict(["spent 1000rs in food today"]))
class NoteList(APIView):
    """
    List all snippets, or create a new note.
    """
    def get(self, request, format=None):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteDetail(APIView):
    """
    Retrieve, update or delete a note instance.
    """
    def get_object(self, pk):
        try:
            return Note.objects.get(pk=pk)
        except Note.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        note = self.get_object(pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        note = self.get_object(pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        note = self.get_object(pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotePrediction(APIView):
    """
    Returns predictions for notes based on the loaded model.
    """

    def post(self, request):
        text = request.data['text']
        # print(request.data['text'])
        if text is None:
            return Response({'error': 'Text parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        prediction = model.predict([text])

        return Response({'prediction': prediction[0]}, status=status.HTTP_200_OK)
