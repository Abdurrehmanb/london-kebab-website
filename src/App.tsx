import React, { useState, useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

// Types
interface Variant {
  label: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: Variant[];
  meat?: boolean;
  pizzas?: number;
  kebabs?: number;
}

interface CartItem {
  key: string;
  name: string;
  detail: string;
  price: number;
  quantity: number;
}

const CATEGORIES = [
  "Pizzas",
  "Kebab y durum",
  "Burgers",
  "Platos",
  "Acompañamientos",
  "Bebidas",
  "Ofertas",
];

const PIZZA_SIZES: Variant[] = [
  { label: "Pequeña · 25 cm", price: 800 },
  { label: "Mediana · 32 cm", price: 900 },
  { label: "Familiar · 40 cm", price: 1200 },
];

const PIZZA_RECIPES: [string, string, string][] = [
  ["margarita", "Margarita", "Salsa de tomate, mozzarella y orégano."],
  ["atun", "Atún", "Salsa de tomate, mozzarella, atún y orégano."],
  ["barbacoa", "Barbacoa", "Salsa de tomate, mozzarella, pollo y cebolla."],
  ["pollo", "Pollo", "Salsa de tomate, orégano, pollo asado, cebolla y champiñón."],
  ["kebab", "Pizza kebab", "Tomate, mozzarella, carne de kebab, orégano y salsa de kebab."],
  ["calzone", "Calzone", "Tomate, queso, orégano, atún, pollo y cebolla."],
  ["italiana", "Pizza italiana", "Tomate, queso, gambas, atún, anchoas, olivas, cebolla y orégano."],
  ["quesos", "4 quesos", "Tomate, 4 quesos y orégano."],
  ["vegetariana", "Vegetariana", "Tomate, queso, champiñón, aceitunas negras, cebolla y alcachofas."],
  ["jumilla", "Pizza Jumilla", "Tomate, mozzarella, queso, salami, cebolla, huevo y orégano."],
  ["carbonara", "Carbonara", "Tomate, nata, mozzarella, salami, cebolla, huevo y orégano."],
  ["fungi", "Fungi", "Tomate, queso, champiñón, maíz, olivas y orégano."],
  ["hawaiana", "Hawaiana", "Tomate, queso, pollo, piña y orégano."],
  ["deseo", "Deseo", "Tomate, queso, pollo, cebolla, pimiento rojo y verde, salsa picante."],
];

const soloMenu = (solo: number, menu: number): Variant[] => [
  { label: "Solo", price: solo },
  { label: "Menú · con patatas y bebida", price: menu },
];

const PRODUCTS: Product[] = [
  ...PIZZA_RECIPES.map(([id, name, desc]) => ({
    id: `pizza-${id}`,
    name,
    description: desc,
    category: "Pizzas",
    variants: PIZZA_SIZES,
  })),
  {
    id: "pita",
    name: "Kebab pita",
    description: "Pollo o ternera en pan de pita.",
    category: "Kebab y durum",
    variants: soloMenu(450, 650),
    meat: true,
  },
  {
    id: "rollo",
    name: "Kebab rollo",
    description: "Pollo o ternera. Todo el sabor, enrollado.",
    category: "Kebab y durum",
    variants: soloMenu(400, 750),
    meat: true,
  },
  {
    id: "falafel",
    name: "Falafel · pita o rollo",
    description: "Elige tamaño y formato.",
    category: "Kebab y durum",
    variants: [
      { label: "Pequeño", price: 300 },
      { label: "Normal", price: 400 },
      { label: "Grande", price: 450 },
      { label: "Menú · con patatas y bebida", price: 650 },
    ],
  },
  {
    id: "turca",
    name: "Pizza turca",
    description: "Pollo o ternera.",
    category: "Kebab y durum",
    variants: soloMenu(550, 800),
    meat: true,
  },
  {
    id: "xxl",
    name: "Rollo XXL",
    description: "Pollo o ternera, en formato XXL.",
    category: "Kebab y durum",
    variants: soloMenu(600, 800),
    meat: true,
  },
  {
    id: "xxl-gratinado",
    name: "Rollo XXL gratinado",
    description: "Pollo o ternera, verdura y queso. Menú con bebida.",
    category: "Kebab y durum",
    variants: [
      { label: "Solo", price: 700 },
      { label: "Menú · con bebida", price: 900 },
    ],
    meat: true,
  },
  {
    id: "wrap",
    name: "Especial wrap",
    description: "Burrito o chicken wrap con ensalada, queso, salsa, patatas y bebida.",
    category: "Kebab y durum",
    variants: [{ label: "Completo", price: 850 }],
  },
  {
    id: "burger",
    name: "Beef burger",
    description: "Pollo o ternera. Menú con patatas y bebida.",
    category: "Burgers",
    variants: soloMenu(400, 650),
    meat: true,
  },
  {
    id: "ankara",
    name: "Plato Ankara",
    description: "Pollo, ternera o mixto. Ensalada, patatas y salsa. Menú con bebida.",
    category: "Platos",
    variants: [
      { label: "Solo", price: 750 },
      { label: "Menú · con bebida", price: 850 },
    ],
    meat: true,
  },
  {
    id: "plato-falafel",
    name: "Plato falafel",
    description: "4 falafel, ensalada, patatas y salsa. Menú con bebida.",
    category: "Platos",
    variants: [
      { label: "Solo", price: 600 },
      { label: "Menú · con bebida", price: 800 },
    ],
  },
  {
    id: "plato-kebab",
    name: "Plato kebab normal",
    description: "Pollo, ternera o mixto, ensalada, arroz, patatas y salsa. Menú con bebida.",
    category: "Platos",
    variants: [
      { label: "Solo", price: 750 },
      { label: "Menú · con bebida", price: 850 },
    ],
    meat: true,
  },
  {
    id: "plato-gratinado",
    name: "Plato gratinado",
    description: "Carne, verdura, patatas y queso fundido. Menú con bebida.",
    category: "Platos",
    variants: [
      { label: "Solo", price: 750 },
      { label: "Menú · con bebida", price: 850 },
    ],
  },
  {
    id: "king",
    name: "Plato King especial",
    description: "Pollo o ternera, ensalada, patatas, salsa y queso. Menú con bebida.",
    category: "Platos",
    variants: [
      { label: "Solo", price: 850 },
      { label: "Menú · con bebida", price: 950 },
    ],
    meat: true,
  },
  {
    id: "bandeja",
    name: "Bandeja",
    description: "Ternera, pollo o mixto, patatas y salsa.",
    category: "Platos",
    variants: [{ label: "Ración", price: 800 }],
    meat: true,
  },
  {
    id: "alitas",
    name: "Alitas de pollo",
    description: "5 alitas, ensalada, patatas y salsa. Menú con bebida.",
    category: "Acompañamientos",
    variants: [
      { label: "Solo", price: 500 },
      { label: "Menú · con bebida", price: 750 },
    ],
  },
  {
    id: "nuggets",
    name: "Nuggets de pollo",
    description: "6 nuggets, ensalada, patatas y salsa. Menú con bebida.",
    category: "Acompañamientos",
    variants: [
      { label: "Solo", price: 400 },
      { label: "Menú · con bebida", price: 650 },
    ],
  },
  {
    id: "popcorn",
    name: "Ración popcorn",
    description: "6 unidades y 2 salsas.",
    category: "Acompañamientos",
    variants: [{ label: "Ración", price: 500 }],
  },
  {
    id: "kentucky",
    name: "Pollo Kentucky",
    description: "8 unidades.",
    category: "Acompañamientos",
    variants: [{ label: "Ración", price: 600 }],
  },
  {
    id: "patatas",
    name: "Patatas fritas",
    description: "Para acompañar tu pedido.",
    category: "Acompañamientos",
    variants: [
      { label: "Pequeñas", price: 200 },
      { label: "Grandes", price: 300 },
    ],
  },
  {
    id: "box",
    name: "Box",
    description: "Carne, patatas y salsa.",
    category: "Acompañamientos",
    variants: [
      { label: "Pequeño", price: 300 },
      { label: "Grande", price: 450 },
    ],
  },
  {
    id: "box-carne",
    name: "Box solo carne",
    description: "Sin acompañamientos.",
    category: "Acompañamientos",
    variants: [
      { label: "Pequeño", price: 400 },
      { label: "Grande", price: 550 },
    ],
  },
  {
    id: "arroz",
    name: "Arroz",
    description: "Una guarnición sencilla.",
    category: "Acompañamientos",
    variants: [
      { label: "Pequeño", price: 400 },
      { label: "Grande", price: 400 },
    ],
  },
  {
    id: "gratinadas",
    name: "Patatas gratinadas",
    description: "Patatas, salsa, queso y cebolla.",
    category: "Acompañamientos",
    variants: [{ label: "Ración", price: 600 }],
  },
  {
    id: "ensalada",
    name: "Ensalada",
    description: "Lechuga, tomate, cebolla, zanahoria, olivas y maíz.",
    category: "Acompañamientos",
    variants: [{ label: "Ración", price: 500 }],
  },
  {
    id: "agua",
    name: "Agua",
    description: "Elige el formato.",
    category: "Bebidas",
    variants: [
      { label: "50 cl", price: 100 },
      { label: "1,5 l", price: 250 },
    ],
  },
  {
    id: "cola",
    name: "Coca-Cola",
    description: "Botella de 2 litros.",
    category: "Bebidas",
    variants: [{ label: "2 l", price: 250 }],
  },
  {
    id: "cerveza",
    name: "Cerveza",
    description: "Consulta las opciones al confirmar.",
    category: "Bebidas",
    variants: [{ label: "Unidad", price: 250 }],
  },
  {
    id: "oferta-kebab",
    name: "Para compartir · 3 kebab",
    description: "3 kebab (pita o rollo), 3 patatas, 5 alitas y bebida de 2 l.",
    category: "Ofertas",
    variants: [{ label: "Oferta", price: 2300 }],
    kebabs: 3,
  },
  {
    id: "oferta-2",
    name: "2 pizzas medianas",
    description: "Con bebida grande.",
    category: "Ofertas",
    variants: [{ label: "Oferta", price: 1700 }],
    pizzas: 2,
  },
  {
    id: "oferta-3",
    name: "3 pizzas medianas",
    description: "Con 1 patata, ensalada y bebida grande.",
    category: "Ofertas",
    variants: [{ label: "Oferta", price: 2400 }],
    pizzas: 3,
  },
  {
    id: "oferta-familiar",
    name: "2 pizzas familiares",
    description: "Con 1 patata mediana y bebida grande.",
    category: "Ofertas",
    variants: [{ label: "Oferta", price: 2500 }],
    pizzas: 2,
  },
  {
    id: "pareja",
    name: "Menú para 2 personas",
    description: "2 kebab, 2 patatas, 4 alitas y bebida de 2 l.",
    category: "Ofertas",
    variants: [{ label: "Menú", price: 1550 }],
    kebabs: 2,
  },
  {
    id: "especial",
    name: "Kebab especial",
    description: "3 kebab normales (pita o rollo), 3 patatas y 3 bebidas.",
    category: "Ofertas",
    variants: [{ label: "Menú", price: 1850 }],
    kebabs: 3,
  },
];

const formatPrice = (cents: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);

const BUSINESS_INFO = {
  address: "Avda. Levante 14, Bajo",
  city: "30520 Jumilla, Murcia",
  whatsapp: "34625730634",
  maps: "https://www.google.com/maps/search/?api=1&query=London+Kebab+Avda.+Levante+14+Jumilla",
};

const MENU_PDF_URL = "/London_Kebab_Menu.pdf";

// Reusable continuous culinary SVG divider
function CulinaryDivider() {
  return (
    <div className="culinary-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 12h58" />
          <path d="M1142 12h58" />
          <g transform="translate(86 2)">
            <path d="M0 16 17 3l17 13H0Z" />
            <path d="M5 12h24" />
            <path d="m10 8 3 2m7-4 3 2m-1 5 3 2" />
          </g>
          <g transform="translate(332 3)">
            <path d="M2 3h31l-5 16H7L2 3Z" />
            <path d="M8 7h20M10 11h16M12 15h12" />
            <path d="M0 3h35" />
          </g>
          <g transform="translate(573 2)">
            <path d="M7 19V3" />
            <path d="M7 6h24M7 10h22M7 14h20" />
            <path d="M31 3v16" />
            <path d="M4 19h30" />
          </g>
          <g transform="translate(812 3)">
            <path d="M2 3h31l-5 16H7L2 3Z" />
            <path d="M8 7h20M10 11h16M12 15h12" />
            <path d="M0 3h35" />
          </g>
          <g transform="translate(1052 2)">
            <path d="M0 16 17 3l17 13H0Z" />
            <path d="M5 12h24" />
            <path d="m10 8 3 2m7-4 3 2m-1 5 3 2" />
          </g>
          <path d="M37 12h21m104 0h112m36 0h112m34 0h112m35 0h112m34 0h112" opacity=".8" />
          <path d="M170 6q4-5 8 0m392 0q4-5 8 0m392 0q4-5 8 0" opacity=".7" />
        </g>
      </svg>
    </div>
  );
}

// Responsive image with graceful fallback and static hosting compatibility
function ResponsiveImage({
  name,
  alt,
  className = "",
  eager = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const [useRaw, setUseRaw] = useState(false);

  const isNetlify =
    typeof window !== "undefined" && window.location.hostname.endsWith("netlify.app");

  if (hasError) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
        <span>London Kebab &amp; Pizzeria</span>
      </div>
    );
  }

  const src =
    isNetlify && !useRaw
      ? `/.netlify/images?url=/${name}&w=1000&fm=webp&q=85`
      : `/${name}`;

  const srcSet =
    isNetlify && !useRaw
      ? [480, 800, 1200, 1600]
          .map((w) => `/.netlify/images?url=/${name}&w=${w}&fm=webp&q=85 ${w}w`)
          .join(", ")
      : undefined;

  return (
    <img
      className={className}
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 700px) 100vw, 55vw"
      width={1200}
      height={900}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => {
        if (!useRaw && isNetlify) {
          setUseRaw(true);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

// Modal component
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const originalOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${wide ? "cart-modal" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            onClose();
          }
        }
      }}
      aria-label={title}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

// Product configuration modal
function ProductModal({
  product,
  pizzaSize,
  onAdd,
  onClose,
}: {
  product: Product;
  pizzaSize: number;
  onAdd: (item: Omit<CartItem, "quantity">) => void;
  onClose: () => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.category === "Pizzas" ? pizzaSize : 0
  );
  const [meatChoice, setMeatChoice] = useState("Pollo");
  const [formatChoice, setFormatChoice] = useState(
    product.id === "wrap" ? "Burrito" : "Pita"
  );
  const [comboPizzas, setComboPizzas] = useState<string[]>(
    Array.from({ length: product.pizzas || 0 }, () => "Margarita")
  );
  const [comboKebabs, setComboKebabs] = useState<string[]>(
    Array.from({ length: product.kebabs || 0 }, () => "Pita · Pollo")
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const activeVariant = product.variants[selectedVariant];

  const handleAdd = () => {
    const details = [
      activeVariant.label,
      product.meat ? meatChoice : "",
      product.id === "falafel" || product.id === "wrap" ? formatChoice : "",
      ...comboPizzas.map((p, i) => `Pizza ${i + 1}: ${p}`),
      ...comboKebabs.map((k, i) => `Kebab ${i + 1}: ${k}`),
      note.trim() ? `Nota: ${note.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const item = {
      key: JSON.stringify([product.id, details]),
      name: product.name,
      detail: details,
      price: activeVariant.price,
    };

    for (let i = 0; i < quantity; i++) {
      onAdd(item);
    }
    onClose();
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      <div className="modal-body">
        <p className="muted">{product.description}</p>

        {product.variants.length > 1 && (
          <fieldset className="option-field">
            <legend>
              {product.category === "Pizzas" ? "Tamaño" : "Elige tu opción"}
            </legend>
            <div className="variant-options">
              {product.variants.map((variant, idx) => (
                <button
                  key={variant.label}
                  className={`variant ${idx === selectedVariant ? "selected" : ""}`}
                  aria-pressed={idx === selectedVariant}
                  onClick={() => setSelectedVariant(idx)}
                >
                  <span>{variant.label}</span>
                  <strong>{formatPrice(variant.price)}</strong>
                  {idx === selectedVariant && <Check size={17} />}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {product.meat && (
          <label className="field-label">
            Carne
            <select
              value={meatChoice}
              onChange={(e) => setMeatChoice(e.target.value)}
            >
              <option>Pollo</option>
              <option>Ternera</option>
              {["ankara", "plato-kebab", "bandeja"].includes(product.id) && (
                <option>Mixto</option>
              )}
            </select>
          </label>
        )}

        {(product.id === "falafel" || product.id === "wrap") && (
          <label className="field-label">
            Formato
            <select
              value={formatChoice}
              onChange={(e) => setFormatChoice(e.target.value)}
            >
              {(product.id === "wrap"
                ? ["Burrito", "Chicken wrap"]
                : ["Pita", "Rollo"]
              ).map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
        )}

        {comboPizzas.map((val, idx) => (
          <label key={idx} className="field-label">
            Pizza {idx + 1}
            <select
              value={val}
              onChange={(e) =>
                setComboPizzas((prev) =>
                  prev.map((item, i) => (i === idx ? e.target.value : item))
                )
              }
            >
              {PRODUCTS.filter((p) => p.category === "Pizzas").map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        ))}

        {comboKebabs.map((val, idx) => (
          <label key={idx} className="field-label">
            Kebab {idx + 1}
            <select
              value={val}
              onChange={(e) =>
                setComboKebabs((prev) =>
                  prev.map((item, i) => (i === idx ? e.target.value : item))
                )
              }
            >
              {["Pita · Pollo", "Pita · Ternera", "Rollo · Pollo", "Rollo · Ternera"].map(
                (opt) => (
                  <option key={opt}>{opt}</option>
                )
              )}
            </select>
          </label>
        ))}

        <label className="field-label">
          ¿Algo que debamos saber? <span className="optional">Opcional</span>
          <textarea
            placeholder="Sin cebolla, salsas aparte…"
            maxLength={300}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <p className="small muted">
          Si tienes alergias, consulta con el restaurante antes de pedir.
        </p>

        <div className="product-modal-action">
          <div className="quantity-control">
            <button
              className="icon-button"
              disabled={quantity === 1}
              onClick={() => setQuantity((q) => q - 1)}
              aria-label="Reducir cantidad"
            >
              <Minus size={16} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              className="icon-button"
              disabled={quantity >= 30}
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </button>
          </div>
          <button className="button gold" onClick={handleAdd}>
            Añadir · {formatPrice(activeVariant.price * quantity)}
            <Plus size={18} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Video cinema section with desktop & mobile autoplay fix, no visible play button
function CinemaSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video properties for guaranteed autoplay on desktop and mobile
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;

    const playSafe = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      playSafe();
    } else {
      video.addEventListener("canplay", playSafe, { once: true });
    }

    const onVisible = () => {
      if (!document.hidden) {
        playSafe();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", playSafe);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", playSafe);
    };
  }, []);

  return (
    <section className="cinema" aria-label="From dough to fire">
      <video
        ref={videoRef}
        src="/from-dough-to-fire.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video-poster.webp"
        aria-hidden="true"
        onError={() => setVideoError(true)}
        style={{ visibility: videoError ? "hidden" : undefined }}
      />
      <div className="cinema-overlay" />
      <div className="cinema-copy">
        <p>LONDON KEBAB PIZZERIA</p>
        <h2>
          FROM <span>DOUGH</span>
          <br />
          TO <span>FIRE</span>
        </h2>
        <p className="cinema-tagline">Good Food. Good Mood.</p>
      </div>
    </section>
  );
}

export default function App() {
  const [currentCategory, setCurrentCategory] = useState("Pizzas");
  const [pizzaSizeIdx, setPizzaSizeIdx] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [orderType, setOrderType] = useState<"Recoger" | "A domicilio" | "En el local">("Recoger");
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const visibleProducts = PRODUCTS.filter((p) => p.category === currentCategory);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.key === newItem.key);
      if (existing) {
        return prev.map((item) =>
          item.key === newItem.key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setAnnouncement(`${newItem.name} añadido al pedido.`);
    setOrderSent(false);
  };

  const updateQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
    setOrderSent(false);
  };

  const handleCheckout = () => {
    if (!customerName.trim()) {
      setFormError("Escribe tu nombre para que podamos identificar el pedido.");
      document.getElementById("customer-name")?.focus();
      return;
    }

    if (!deliveryAddress.trim()) {
      setFormError("Añade la dirección de entrega en Jumilla.");
      document.getElementById("delivery-address")?.focus();
      return;
    }

    const lines = [
      "Hola, London Kebab. Quiero hacer un pedido.",
      `Nombre: ${customerName.trim()}`,
      `Modalidad: ${orderType}`,
      `Dirección: ${deliveryAddress.trim()}`,
      "",
      ...cart.map(
        (item) => `${item.quantity} × ${item.name}\n${item.detail}\n${formatPrice(item.price * item.quantity)}`
      ),
      "",
      `Total de productos: ${formatPrice(totalPrice)}`,
      orderNotes.trim() ? `Observaciones: ${orderNotes.trim()}` : "",
      "Por favor, confirmad disponibilidad, importe final y tiempo de preparación.",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(lines)}`;
    setWhatsappUrl(url);

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) win.opener = null;

    setFormError("");
    setOrderSent(true);
  };

  const scrollToMenu = (category?: string) => {
    if (category) setCurrentCategory(category);
    setIsMobileNavOpen(false);
    const carta = document.getElementById("carta");
    carta?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a className="brand" href="#" aria-label="London Kebab & Pizzeria, inicio">
            <img src="/logo.png" width={144} height={96} alt="London Kebab & Pizzeria" />
          </a>

          <nav className="desktop-nav" aria-label="Navegación principal">
            <a href="#carta">Nuestra carta</a>
            <a href="#sabor">El sabor London</a>
            <a href="#visitanos">Encuéntranos</a>
          </nav>

          <div className="header-actions">
            <a
              className="pdf-link"
              href={MENU_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Menú PDF <ArrowUpRight size={15} />
            </a>
            <button
              className="button gold header-order"
              onClick={() => (totalCount ? setIsCartOpen(true) : scrollToMenu())}
            >
              Pedir ahora <ArrowUpRight size={16} />
            </button>
            <button
              className="icon-button header-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir pedido, ${totalCount} productos`}
            >
              <ShoppingBag size={21} />
              {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
            </button>
            <button
              className="icon-button mobile-nav-toggle"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
            >
              {isMobileNavOpen ? <X size={23} /> : <MenuIcon size={23} />}
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Navegación móvil">
            <a href="#carta" onClick={() => setIsMobileNavOpen(false)}>
              Nuestra carta
            </a>
            <a href="#sabor" onClick={() => setIsMobileNavOpen(false)}>
              El sabor London
            </a>
            <a href="#visitanos" onClick={() => setIsMobileNavOpen(false)}>
              Encuéntranos
            </a>
            <a href={MENU_PDF_URL} target="_blank" rel="noopener noreferrer">
              Menú oficial PDF <ArrowUpRight size={17} />
            </a>
          </nav>
        )}
      </header>

      <main id="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-main container">
            <div className="hero-copy">
              <h1>
                MUCHO MÁS
                <br />
                QUE <span>KEBAB.</span>
              </h1>
              <p>
                Doner recién cortado. Pizza al horno.
                <br />
                Tu próximo pedido empieza aquí.
              </p>
              <div className="hero-actions">
                <button className="button gold" onClick={() => scrollToMenu()}>
                  Pedir ahora <ArrowUpRight size={19} />
                </button>
                <a
                  className="text-link"
                  href={MENU_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver menú en PDF <ArrowUpRight size={17} />
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <ResponsiveImage
                name="hero.webp"
                alt="Kebab en pan de pita con carne asada, verduras y salsa, acompañado de patatas"
                eager
              />
            </div>
          </div>

          <div className="hero-bottom container">
            <span className="hero-service-tagline">Tu mesa. Tu casa. Tu London.</span>
            <div className="hero-service-items">
              <span>A domicilio</span>
              <span>Para recoger</span>
              <span>En el local</span>
            </div>
            <a href="#carta" aria-label="Bajar a la carta">
              <ArrowDown size={20} />
            </a>
          </div>
        </section>

        {/* Reusable Culinary Divider */}
        <CulinaryDivider />

        {/* Menu Section */}
        <section id="carta" className="menu-section section-light">
          <div className="container">
            <div className="section-heading">
              <div className="menu-heading-block">
                <span className="menu-kicker">CARTA</span>
                <h2 className="menu-headline">¿QUÉ TE APETECE?</h2>
              </div>
              <a
                className="text-link dark-link"
                href={MENU_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                La carta completa en PDF <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="ordering-bar">
              <div className="order-switch" role="group" aria-label="Modalidad del pedido">
                {(["Recoger", "A domicilio", "En el local"] as const).map((type) => (
                  <button
                    key={type}
                    className={orderType === type ? "active" : ""}
                    aria-pressed={orderType === type}
                    onClick={() => {
                      setOrderType(type);
                      setOrderSent(false);
                    }}
                  >
                    {type}
                    {orderType === type && <Check size={14} />}
                  </button>
                ))}
              </div>
              <span className="order-location">
                <MapPin size={16} />
                London Kebab · Jumilla
              </span>
            </div>

            <div className="category-tabs" role="tablist" aria-label="Categorías de la carta">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat}
                  id={`tab-${idx}`}
                  role="tab"
                  aria-selected={currentCategory === cat}
                  aria-controls="menu-products"
                  tabIndex={currentCategory === cat ? 0 : -1}
                  className={currentCategory === cat ? "active" : ""}
                  onClick={() => setCurrentCategory(cat)}
                  onKeyDown={(e) => {
                    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                      e.preventDefault();
                      const currentIdx = CATEGORIES.indexOf(cat);
                      const targetIdx =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                          ? CATEGORIES.length - 1
                          : (currentIdx + (e.key === "ArrowRight" ? 1 : -1) + CATEGORIES.length) %
                            CATEGORIES.length;
                      setCurrentCategory(CATEGORIES[targetIdx]);
                      document.getElementById(`tab-${targetIdx}`)?.focus();
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="menu-tools">
              <p>
                {currentCategory === "Pizzas"
                  ? "Tu pizza, a tu medida."
                  : `${visibleProducts.length} opciones. Tú eliges.`}
              </p>

              {currentCategory === "Pizzas" && (
                <label className="size-select">
                  <span>Tamaño</span>
                  <select
                    value={pizzaSizeIdx}
                    onChange={(e) => setPizzaSizeIdx(Number(e.target.value))}
                  >
                    {PIZZA_SIZES.map((size, idx) => (
                      <option key={size.label} value={idx}>
                        {size.label} · {formatPrice(size.price)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </label>
              )}
            </div>

            <div
              id="menu-products"
              role="tabpanel"
              aria-labelledby={`tab-${CATEGORIES.indexOf(currentCategory)}`}
              className="menu-products"
              tabIndex={0}
            >
              {visibleProducts.map((product) => {
                const basePrice =
                  product.variants[currentCategory === "Pizzas" ? pizzaSizeIdx : 0].price;
                const existingQty = cart
                  .filter((item) => item.name === product.name)
                  .reduce((acc, cur) => acc + cur.quantity, 0);

                return (
                  <article key={product.id} className="menu-row">
                    <div className="menu-row-copy">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="menu-row-end">
                      <span className="menu-price">
                        {product.category !== "Pizzas" && product.variants.length > 1 && (
                          <small>desde </small>
                        )}
                        {formatPrice(basePrice)}
                      </span>
                      <button
                        className={`add-button ${existingQty ? "added" : ""}`}
                        aria-label={`Elegir ${product.name}${
                          existingQty ? `, ${existingQty} en tu pedido` : ""
                        }`}
                        onClick={() => setActiveProduct(product)}
                      >
                        {existingQty ? <span>{existingQty}</span> : <Plus size={18} />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="menu-note">
              <span>
                Precios según nuestra carta oficial. ¿Alergias? Consúltanos antes de pedir.
              </span>
              <button className="text-link dark-link" onClick={() => setIsCartOpen(true)}>
                Ver mi pedido {totalCount > 0 && `(${totalCount})`} <ShoppingBag size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* Signature Section */}
        <section id="sabor" className="signature container">
          <div className="signature-image">
            <ResponsiveImage
              name="doner.webp"
              alt="Doner en pan tostado con carne, lechuga, cebolla y salsa"
            />
            
          </div>

          <div className="signature-copy">
            <h2>
              EL KEBAB.
              <br />
              SIN RODEOS.
            </h2>
            <p>
              Pan, carne, verduras y salsa.
              <br />
              Lo importante está dentro.
            </p>
            <p className="signature-detail">
              Pollo o ternera. En pita, en rollo o en plato.
              <br />
              Elige el tuyo; nosotros nos encargamos del resto.
            </p>
            <button
              className="text-link"
              onClick={() => scrollToMenu("Kebab y durum")}
            >
              Ver kebabs y durum <ArrowUpRight size={19} />
            </button>
          </div>
        </section>

        {/* Reusable Culinary Divider */}
        <CulinaryDivider />

        {/* Cinema Video Section with Autoplay Fix */}
        <CinemaSection />

        {/* Reusable Culinary Divider */}
        <CulinaryDivider />

        {/* Pizza Section */}
        <section className="pizza-section section-light">
          <div className="container pizza-grid">
            <div className="pizza-copy">
              <h2>
                LA PIZZA NO
                <br />
                ES UN EXTRA.
              </h2>
              <p>
                Margarita, Barbacoa, Kebab o Jumilla.
                <br />
                Catorce recetas. Tres tamaños.
                <br />
                Y una buena razón para compartir.
              </p>
              <button
                className="text-link dark-link"
                onClick={() => scrollToMenu("Pizzas")}
              >
                Elige tu pizza <ArrowUpRight size={19} />
              </button>
              <div className="pizza-sizes">
                <div>
                  <span>
                    25<small>cm</small>
                  </span>
                  <p>Pequeña</p>
                </div>
                <div>
                  <span>
                    32<small>cm</small>
                  </span>
                  <p>Mediana</p>
                </div>
                <div>
                  <span>
                    40<small>cm</small>
                  </span>
                  <p>Familiar</p>
                </div>
              </div>
            </div>

            <div className="pizza-visual">
              <ResponsiveImage
                name="pizza.webp"
                alt="Pizza de kebab recién horneada con queso, carne y verduras"
              />
              
            </div>
          </div>
        </section>

        {/* Reusable Culinary Divider */}
        <CulinaryDivider />

        {/* Offer Section */}
        <section className="offer-section">
          <div className="container offer-grid">
            <div className="offer-copy">
              <p className="eyebrow">EL PLAN ES COMPARTIR</p>
              <h2>
                TRES KEBAB.
                <br />
                CERO EXCUSAS.
              </h2>
              <p>
                3 kebab en pita o rollo, 3 patatas,
                <br />
                5 alitas y una bebida de 2 litros.
              </p>
              <div className="offer-action">
                <span className="offer-price">
                  23<small>,00 €</small>
                </span>
                <button
                  className="button ink"
                  onClick={() => {
                    const offer = PRODUCTS.find((p) => p.id === "oferta-kebab");
                    if (offer) setActiveProduct(offer);
                  }}
                >
                  Añadir al pedido <Plus size={18} />
                </button>
              </div>
              <button
                className="text-link dark-link"
                onClick={() => scrollToMenu("Ofertas")}
              >
                Más opciones para compartir <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="offer-image">
              <ResponsiveImage
                name="combo.webp"
                alt="Kebab, patatas, alitas de pollo y refresco para compartir"
              />
              
            </div>
          </div>
        </section>

        {/* Reusable Culinary Divider */}
        <CulinaryDivider />

        {/* Location Section */}
        <section id="visitanos" className="location-section container">
          <div className="location-title">
            <p className="eyebrow">NOS VEMOS EN JUMILLA</p>
            <h2>
              EL MISMO SABOR.
              <br />
              TU SITIO DE SIEMPRE.
            </h2>
            <p>
              Ven al local, recoge tu pedido
              <br />
              o escríbenos y pide a domicilio.
            </p>
            <a
              className="text-link"
              href={BUSINESS_INFO.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar <ArrowUpRight size={19} />
            </a>
          </div>

          <div className="location-info">
            <div className="info-row">
              <MapPin size={21} />
              <div>
                <h3>London Kebab &amp; Pizzeria</h3>
                <address>
                  {BUSINESS_INFO.address}
                  <br />
                  {BUSINESS_INFO.city}
                </address>
              </div>
            </div>

            <div className="info-row">
              <span className="info-icon">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <h3>Horario</h3>
                <p>
                  12:00–16:00
                  <br />
                  18:00–00:00
                </p>
              </div>
            </div>

            <div className="info-row">
              <Phone size={21} />
              <div>
                <h3>Hablemos</h3>
                <a href="tel:+34868240342">868 240 342</a>
                <br />
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp · 625 730 634 <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            <div className="location-halal">
              <span>100% HALAL</span>
              <p>Kebab &amp; Pizzeria</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Official Logo */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <a
              className="footer-wordmark footer-brand"
              href="#"
              aria-label="London Kebab & Pizzeria, inicio"
            >
              <img
                src="/logo.png"
                width={108}
                height={72}
                alt="London Kebab & Pizzeria"
              />
            </a>

            <nav aria-label="Enlaces del pie">
              <a href={MENU_PDF_URL} target="_blank" rel="noopener noreferrer">
                Menú PDF <ArrowUpRight size={14} />
              </a>
              <a href="#carta">Pedir</a>
              <a href="#visitanos">Contacto</a>
            </nav>

            <p>
              <a href="tel:+34868240342">868 240 342</a>
            </p>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} London Kebab &amp; Pizzeria</span>
            <span>Jumilla, Murcia</span>
            <span>
              Powered by{" "}
              <a
                href="https://iamabdurrehman.online/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Webnix <ArrowUpRight size={11} />
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      {totalCount > 0 && !isCartOpen && !activeProduct && (
        <button
          className="floating-cart"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Abrir tu pedido, ${totalCount} productos por ${formatPrice(totalPrice)}`}
        >
          <span>
            <ShoppingBag size={20} />
            <span className="floating-cart-count">{totalCount}</span>
            Tu pedido
          </span>
          <strong>
            {formatPrice(totalPrice)} <ArrowRight size={18} />
          </strong>
        </button>
      )}

      {/* Screen Reader Status Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Product Customizer Modal */}
      {activeProduct && (
        <ProductModal
          key={activeProduct.id}
          product={activeProduct}
          pizzaSize={pizzaSizeIdx}
          onAdd={addToCart}
          onClose={() => setActiveProduct(null)}
        />
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <Modal title="Tu pedido" onClose={() => setIsCartOpen(false)} wide>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={42} strokeWidth={1} />
              <h3>Algo bueno empieza aquí.</h3>
              <p>
                Elige lo que te apetece en la carta.
                <br />
                Tu pedido te espera en este espacio.
              </p>
              <button
                className="button gold"
                onClick={() => {
                  setIsCartOpen(false);
                  scrollToMenu();
                }}
              >
                Ir a la carta <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="modal-body cart-body">
              <div className="cart-lines">
                {cart.map((item) => (
                  <div key={item.key} className="cart-line">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                      <button
                        className="remove-link"
                        onClick={() => {
                          setCart((prev) => prev.filter((i) => i.key !== item.key));
                          setOrderSent(false);
                        }}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="cart-line-controls">
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                      <div className="quantity-control">
                        <button
                          className="icon-button"
                          onClick={() => updateQuantity(item.key, -1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                        >
                          <Minus size={15} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="icon-button"
                          disabled={item.quantity >= 99}
                          onClick={() => updateQuantity(item.key, 1)}
                          aria-label={`Añadir una unidad de ${item.name}`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Total de productos</span>
                <strong aria-live="polite">{formatPrice(totalPrice)}</strong>
              </div>

              <p className="small muted">
                No se cobra en esta web. El restaurante confirma disponibilidad, tiempo e
                importe final por WhatsApp.
                {orderType === "A domicilio"
                  ? " El coste y la zona de entrega se confirman antes de preparar el pedido."
                  : ""}
              </p>

              <fieldset className="option-field">
                <legend>¿Cómo lo quieres?</legend>
                <div className="order-switch cart-order-switch">
                  {(["Recoger", "A domicilio", "En el local"] as const).map((type) => (
                    <button
                      key={type}
                      className={orderType === type ? "active" : ""}
                      aria-pressed={orderType === type}
                      onClick={() => {
                        setOrderType(type);
                        setOrderSent(false);
                        setFormError("");
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="field-label" htmlFor="customer-name">
                Tu nombre
                <input
                  id="customer-name"
                  autoComplete="name"
                  value={customerName}
                  maxLength={80}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setOrderSent(false);
                    setFormError("");
                  }}
                  required
                  aria-invalid={!!formError && !customerName.trim()}
                  placeholder="¿A nombre de quién?"
                />
              </label>

              <label className="field-label" htmlFor="delivery-address">
                  Dirección de entrega
                  <input
                    id="delivery-address"
                    autoComplete="street-address"
                    value={deliveryAddress}
                    maxLength={200}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      setOrderSent(false);
                      setFormError("");
                    }}
                    required
                    aria-invalid={!!formError && !deliveryAddress.trim()}
                    placeholder="Calle, número, piso…"
                  />
                </label>
              <label className="field-label">
                Observaciones <span className="optional">Opcional</span>
                <textarea
                  maxLength={500}
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => {
                    setOrderNotes(e.target.value);
                    setOrderSent(false);
                  }}
                  placeholder="Bebidas del menú, hora de recogida, indicaciones…"
                />
              </label>

              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              {orderSent && (
                <div className="order-feedback" role="status">
                  <Check size={19} />
                  <p>
                    Tu mensaje está listo.{" "}
                    <strong>Envíalo por WhatsApp y espera la confirmación del restaurante.</strong>{" "}
                    Si no se abre,{" "}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      abre WhatsApp aquí
                    </a>{" "}
                    o llama al <a href="tel:+34868240342">868 240 342</a>.
                  </p>
                </div>
              )}

              <button
                className="button gold checkout-button"
                onClick={handleCheckout}
              >
                Continuar en WhatsApp <ArrowUpRight size={19} />
              </button>

              <button
                className="continue-link"
                onClick={() => {
                  setIsCartOpen(false);
                  scrollToMenu();
                }}
              >
                Seguir eligiendo
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
