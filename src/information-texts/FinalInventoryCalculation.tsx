import React from 'react';

export const HOW_CALCULATE = {
    TITLE: '¿Cómo se calcula el inventario final?',
    DESCRIPTION: (
        <p className="text-base text-tooltip font-aller text-blue">
            <strong className="font-allerbold"> 1. Registrar compras y ventas: </strong> Documentar todas las compras y ventas de
            mercancías durante el período contable.
            <br />
            <strong className="font-allerbold"> 2. Contabilizar devoluciones:</strong> Incluir devoluciones de proveedores y
            clientes.
            <br />
            <strong className="font-allerbold"> 3. Calcular el costo de las mercancías vendidas: </strong> Usar el método
            seleccionado para determinar este costo.
            <br />
            <strong className="font-allerbold"> 4. Calcular el inventario final:</strong> Aplica el método elegido para realizar
            el cálculo del inventario final.
        </p>
    ),
};

export const WHICH_IS_THE_BASE = {
    CPP_TITLE: '¿En qué se basa el método CPP?',
    CPP_DESCRIPTION: (
        <p className="pr-1 text-base text-tooltip font-aller text-blue">
            El metodo CPP se calcula con el valor promedio de cada artículo en el inventario, primero se establece un costo medio
            basado en el precio de adquisición a lo largo del periodo contable. Luego, se multiplica este valor promedio por el
            número total de unidades presentes en el inventario al final del periodo.
        </p>
    ),
    PEPS_TITLE: '¿En qué se basa el método de PEPS?',
    PEPS_DESCRIPTION: (
        <p className="text-base font-aller text-tooltip text-blue">
            El método PEPS asume que los primeros productos adquiridos son los primeros en venderse, valorando el stock restante
            al último precio de adquisición.
        </p>
    ),
};
