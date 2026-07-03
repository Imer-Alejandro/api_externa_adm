const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

const queryDisponibilidad = `
SELECT
    ROW_NUMBER() OVER (ORDER BY i.ID) AS ItemNumber,

    venta.DocID AS Pedido,
    venta.ID AS Link,
    venta.DocDate AS Fecha,

    i.ID,
    i.SKU,
    i.Name AS ItemName,

    i.CUSTOM_NoCasa,
    tipo.Name AS TipoInmueble,

    i.CUSTOM_M2Solar,
    i.CUSTOM_M2Construccion,

    estado.Name AS Estado,

    i.Notes,
    contratista.Name AS Contratista,

    i.CUSTOM_PropietarioTitulo,
    i.CUSTOM_Solar,

    cliente.ID AS CustomerID,
    cliente.Name AS CustomerName,

    proyecto.Name AS Etapa,

    precio.Price,

    CASE
        WHEN venta.ID IS NULL THEN 'Disponible'
        ELSE 'Reservada'
    END AS EstadoPago

FROM IC_Items i

LEFT JOIN SA_CustomLists_Options tipo
    ON tipo.ID = i.CUSTOM_TipoInmueble

LEFT JOIN SA_CustomLists_Options estado
    ON estado.ID = i.CUSTOM_Estado

LEFT JOIN SA_Relationships contratista
    ON contratista.ID = i.CUSTOM_Contratista

LEFT JOIN PA_Projects proyecto
    ON proyecto.ID = i.CUSTOM_Etapa

LEFT JOIN
(
    SELECT
        ItemID,
        MAX(Price) AS Price
    FROM IC_Items_Price_Levels
    GROUP BY ItemID
) precio
ON precio.ItemID = i.ID

LEFT JOIN
(
    SELECT
        ti.ItemID,
        t.ID,
        t.DocID,
        t.DocDate,
        t.RelationshipID
    FROM SA_Trans_Items ti
    INNER JOIN SA_Transactions t
        ON t.ID = ti.TransID
    WHERE
        t.DocType = 'SO'
        AND t.Void = 0
) venta
ON venta.ItemID = i.ID

LEFT JOIN SA_Relationships cliente
    ON cliente.ID = venta.RelationshipID

WHERE
    i.CUSTOM_Inmueble = 1

ORDER BY
    i.Name;
`;

router.get('/', async (req, res) => {
  try {
    const etapa = req.query.etapa || null;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Etapa', sql.NVarChar(100), etapa)
      .query(queryDisponibilidad);

    return res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error en /disponibilidad-inmueble:', error.message || error);
    return res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
});

module.exports = router;
