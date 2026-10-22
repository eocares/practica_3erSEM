package pe.edu.cafeteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.cafeteria.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Integer> {}
