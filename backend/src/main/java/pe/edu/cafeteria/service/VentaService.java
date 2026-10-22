package pe.edu.cafeteria.service;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pe.edu.cafeteria.model.*;
import pe.edu.cafeteria.repository.VentaRepository;
import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaService {
    private final VentaRepository repo;
    private final ProductoService productos;
    public VentaService(VentaRepository repo, ProductoService productos) { this.repo = repo; this.productos = productos; }

    public List<Venta> listar() { return repo.findAll(); }

    @Transactional
    public Venta registrar(Venta v) {
        Producto p = productos.obtener(v.getProducto().getId());
        if (p.getFechaEliminacion() != null || !p.getActivo())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no disponible");
        if (p.getStock() < v.getCantidad())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente");
        p.setStock(p.getStock() - v.getCantidad());
        v.setId(null);
        v.setProducto(p);
        v.setPrecioUnitario(p.getPrecio());
        v.setTotal(p.getPrecio().multiply(BigDecimal.valueOf(v.getCantidad())));
        return repo.save(v);
    }
}
