import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { themeColors } from '../../config';

interface NavItem {
    label: string;
    link: string;
}

interface NavProps {
    style?: React.CSSProperties;
    items: NavItem[];
    itemStyle?: React.CSSProperties;
    activeItemStyle?: React.CSSProperties; // Prop para estilos del item activo
    className?: string;
}

const Nav: React.FC<NavProps> = ({ style, itemStyle, activeItemStyle, items, className = 'precooked-nav' }) => {
    const location = useLocation(); // Obtener la ruta actual

    const defaultItemStyle: React.CSSProperties = {
        textDecoration: 'none', // Sin subrayado
        color: themeColors.text, // Color por defecto
        margin: '0 10px', // Margen entre los items
        padding: '8px 16px', // Padding por defecto
    };

    const defaultActiveItemStyle: React.CSSProperties = {
        backgroundColor: themeColors.primary, // Fondo de item activo
        color: '#fff', // Texto blanco para item activo
        borderRadius: '20px', // Bordes redondeados (pildora)
    };

    return (
        <nav className={className} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
            {items?.map((item, index) => {
                // Verificar si el item es activo comparando el link con la ruta actual
                const isActive = location.pathname === item.link;

                return (
                    <Link
                        key={index}
                        to={item.link} // Navegar a la ruta correspondiente
                        style={isActive ? { ...defaultItemStyle, ...itemStyle, ...defaultActiveItemStyle, ...activeItemStyle } : { ...defaultItemStyle, ...itemStyle }}
                        className={isActive ? "active" : ""}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Nav;
