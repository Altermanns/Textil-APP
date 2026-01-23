
import json
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

from ..models import Materia

@login_required
@require_http_methods(["GET"])
def list_materias_api(request):
    """
    API endpoint to list all Materia objects.
    """
    materias = Materia.objects.all()
    # Convert queryset to a list of dictionaries
    data = [model_to_dict(materia) for materia in materias]
    return JsonResponse(data, safe=False)

# Placeholder for the other CRUD operations

@login_required
@require_http_methods(["POST"])
def create_materia_api(request):
    try:
        data = json.loads(request.body)
        # Basic validation
        if not data.get('tipo') or not data.get('cantidad'):
            return JsonResponse({"error": "Tipo and Cantidad are required"}, status=400)
        
        materia = Materia.objects.create(
            tipo=data.get('tipo', ''),
            cantidad=data.get('cantidad', 0),
            unidad_medida=data.get('unidad_medida', ''),
            lote=data.get('lote', ''),
            fecha_ingreso=data.get('fecha_ingreso'),
            usuario_registro=request.user
        )
        return JsonResponse(model_to_dict(materia), status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@require_http_methods(["GET", "PUT", "DELETE"])
def detail_materia_api(request, materia_id):
    try:
        materia = Materia.objects.get(pk=materia_id)
    except Materia.DoesNotExist:
        return JsonResponse({"error": "Materia not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(model_to_dict(materia))

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            materia.tipo = data.get('tipo', materia.tipo)
            materia.cantidad = data.get('cantidad', materia.cantidad)
            materia.unidad_medida = data.get('unidad_medida', materia.unidad_medida)
            materia.lote = data.get('lote', materia.lote)
            materia.fecha_ingreso = data.get('fecha_ingreso', materia.fecha_ingreso)
            materia.save()
            return JsonResponse(model_to_dict(materia))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    if request.method == "DELETE":
        materia.delete()
        return JsonResponse({"message": "Materia deleted successfully"}, status=204)
