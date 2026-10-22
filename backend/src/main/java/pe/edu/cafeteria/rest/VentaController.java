package pe.edu.cafeteria.rest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.edu.cafeteria.model.Venta;
import pe.edu.cafeteria.service.VentaService;
import java.util.List;

@RestController @RequestMapping("/api/ventas")
public class VentaController {
    private final VentaService service;
    public VentaController(VentaService service) { this.service = service; }

    @GetMapping public List<Venta> listar() { return service.listar(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Venta registrar(@Valid @RequestBody Venta v) { return service.registrar(v); }
}
