package pe.edu.cafeteria.rest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.edu.cafeteria.model.Producto;
import pe.edu.cafeteria.service.ProductoService;
import java.util.List;

@RestController @RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoService service;
    public ProductoController(ProductoService service) { this.service = service; }

    @GetMapping public List<Producto> listar() { return service.listar(); }
    @GetMapping("/eliminados") public List<Producto> eliminados() { return service.listarEliminados(); }
    @GetMapping("/{id}") public Producto obtener(@PathVariable Integer id) { return service.obtener(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto p) { return service.crear(p); }
    @PutMapping("/{id}") public Producto editar(@PathVariable Integer id, @Valid @RequestBody Producto p) { return service.editar(id, p); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) { service.eliminar(id); }
    @PatchMapping("/{id}/restaurar") public Producto restaurar(@PathVariable Integer id) { return service.restaurar(id); }
}
