import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description: "Información sobre tiempos, costos y zonas de envío de Peptigene en Colombia.",
};

export default function EnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Información</p>
      <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-12">
        Envíos y devoluciones
      </h1>

      <div className="space-y-12 text-olive-800 leading-relaxed">
        <section>
          <h2 className="font-display text-3xl text-olive-900 mb-4">Tiempos de entrega</h2>
          <p className="mb-6">
            Despachamos todos los pedidos confirmados antes de las 2:00 p.m. el
            mismo día hábil. Los tiempos varían según la ciudad de destino.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { zona: "Medellín y área metropolitana", tiempo: "1–2 días hábiles" },
              { zona: "Bogotá, Cali, Barranquilla", tiempo: "2–3 días hábiles" },
              { zona: "Capitales departamentales", tiempo: "3–5 días hábiles" },
              { zona: "Municipios y zonas rurales", tiempo: "5–8 días hábiles" },
            ].map((row) => (
              <div
                key={row.zona}
                className="bg-cream-50 border border-olive-100 rounded-2xl p-5"
              >
                <p className="eyebrow text-olive-600 mb-2">{row.zona}</p>
                <p className="font-display text-xl text-olive-900">{row.tiempo}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-olive-900 mb-4">Costos</h2>
          <p className="mb-4">
            El costo del envío se calcula automáticamente al ingresar tu
            dirección en el checkout. Como referencia:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Pedidos superiores a $200.000 COP tienen envío gratis a todo el país.</li>
            <li>Envíos urbanos estándar desde $15.000 COP.</li>
            <li>Envíos a zonas rurales pueden tener un recargo según el operador.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-olive-900 mb-4">Seguimiento</h2>
          <p>
            Una vez despachado tu pedido, recibirás un correo con el número de
            guía y el enlace para hacer seguimiento en la página del operador
            logístico. Si no recibes esta información en 24 horas hábiles
            después de confirmar tu compra, escríbenos a{" "}
            <span className="text-olive-700">soporte@peptigene.demo</span>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-olive-900 mb-4">Devoluciones</h2>
          <p className="mb-4">
            Aceptamos devoluciones dentro de los 5 días hábiles siguientes a la
            recepción del pedido, siempre que se cumplan estas condiciones:
          </p>
          <ul className="space-y-2 list-disc list-inside mb-4">
            <li>El producto está sin abrir, sellado y en su empaque original.</li>
            <li>No presenta señales de uso ni daño causado por el cliente.</li>
            <li>Se conserva la factura o número de pedido.</li>
          </ul>
          <p>
            Por la naturaleza del producto (suplementos alimentarios), no se
            aceptan devoluciones de envases abiertos, excepto en casos de
            defecto de fábrica comprobable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-olive-900 mb-4">Cambios</h2>
          <p>
            Si recibiste un producto distinto al que pediste o llegó dañado,
            contáctanos en las primeras 48 horas y coordinamos el cambio sin
            costo. La recolección la programamos con nuestro operador
            logístico.
          </p>
        </section>
      </div>
    </div>
  );
}
