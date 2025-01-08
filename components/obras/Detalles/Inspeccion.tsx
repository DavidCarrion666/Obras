import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Inspeccion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoreo e Inspección</CardTitle>
        <CardDescription>
          Validación de tareas, presupuestos y registro de problemas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tarea-inspeccion">Tarea a Inspeccionar</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Preparación del terreno</SelectItem>
                <SelectItem value="2">Cimentación</SelectItem>
                <SelectItem value="3">Estructura</SelectItem>
                <SelectItem value="4">Acabados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="observacion-inspeccion">Observaciones</Label>
            <Textarea
              id="observacion-inspeccion"
              placeholder="Ingrese observaciones de la inspección"
            />
          </div>
          <div>
            <Label htmlFor="evidencia-inspeccion">Adjuntar Evidencia</Label>
            <Input id="evidencia-inspeccion" type="file" />
          </div>
          <Button>Registrar Inspección</Button>
        </div>
      </CardContent>
    </Card>
  );
}
