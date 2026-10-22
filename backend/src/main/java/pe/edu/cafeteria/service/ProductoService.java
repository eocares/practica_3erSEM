package pe.edu.cafeteria.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pe.edu.cafeteria.model.Producto;
import pe.edu.cafeteria.repository.ProductoRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductoService {
    private final ProductoRepository repo;
    public ProductoService(ProductoRepository repo) { this.repo = repo; }

    public List<Producto> listar() { return repo.findByFechaEliminacionIsNull(); }
    public List<Producto> listarEliminados() { return repo.findByFechaEliminacionIsNotNull(); }

    public Producto obtener(Integer id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }
    public Producto crear(Producto p) { p.setId(null); return repo.save(p); }

    public Producto editar(Integer id, Producto datos) {
        Producto p = obtener(id);
        p.setCodigo(datos.getCodigo()); p.setNombre(datos.getNombre());
        p.setDescripcion(datos.getDescripcion()); p.setCategoria(datos.getCategoria());
        p.setOrigen(datos.getOrigen()); p.setPrecio(datos.getPrecio());
        p.setStock(datos.getStock()); p.setActivo(datos.getActivo());
        return repo.save(p);
    }
    public void eliminar(Integer id) {          // eliminación lógica
        Producto p = obtener(id);
        p.setFechaEliminacion(LocalDateTime.now());
        p.setActivo(false);
        repo.save(p);
    }
    public Producto restaurar(Integer id) {
        Producto p = obtener(id);
        p.setFechaEliminacion(null);
        p.setFechaRestauracion(LocalDateTime.now());
        p.setActivo(true);
        return repo.save(p);
    }
}
