package pe.edu.cafeteria.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "venta")
public class Venta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "producto_id")
    private Producto producto;
    @NotBlank private String cliente;
    @NotNull @Min(1) private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal total;
    private Boolean pagado = false;
    private LocalDateTime fechaVenta;

    @PrePersist void antesDeCrear() { if (fechaVenta == null) fechaVenta = LocalDateTime.now(); }
}
