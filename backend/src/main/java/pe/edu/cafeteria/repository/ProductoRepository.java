package pe.edu.cafeteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.cafeteria.model.Producto;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByFechaEliminacionIsNull();
    List<Producto> findByFechaEliminacionIsNotNull();
}
