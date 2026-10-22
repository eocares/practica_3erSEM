package pe.edu.cafeteria.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "producto")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank @Size(max = 20)  private String codigo;
    @NotBlank @Size(max = 100) private String nombre;
    @Size(max = 255)           private String descripcion;
    @NotBlank                  private String categoria;
    @NotBlank                  private String origen;
    @NotNull @DecimalMin("0.01") private BigDecimal precio;
    @NotNull @Min(0)           private Integer stock;
    private Boolean activo = true;
    // Auditoría (4 campos fecha/hora)
    @Column(updatable = false) private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaEliminacion;
    private LocalDateTime fechaRestauracion;

    @PrePersist void antesDeCrear() { fechaCreacion = LocalDateTime.now(); }
    @PreUpdate  void antesDeActualizar() { fechaActualizacion = LocalDateTime.now(); }
}
