import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso del sitio web y la tienda en línea de Peptigene.",
};

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Legal</p>
      <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-4">
        Términos y condiciones
      </h1>
      <p className="text-sm text-olive-700/70 mb-12">
        Última actualización: {new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-8 text-olive-800 leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">1. Aceptación</h2>
          <p>
            Al navegar y realizar compras en este sitio aceptas las condiciones
            descritas aquí. Si no estás de acuerdo con alguna parte, te pedimos
            no usar el servicio.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">2. Producto y precios</h2>
          <p>
            Los precios están expresados en pesos colombianos e incluyen IVA
            cuando aplica. Nos reservamos el derecho a modificar precios y
            disponibilidad sin previo aviso. En caso de error tipográfico
            evidente, podemos cancelar pedidos afectados con reembolso completo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">3. Pedidos y pago</h2>
          <p>
            Un pedido se considera confirmado cuando recibes el correo de
            confirmación con el número correspondiente. Aceptamos los métodos de
            pago listados en el checkout, gestionados por pasarelas externas
            certificadas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">4. Envíos</h2>
          <p>
            Los plazos y costos de envío se detallan en la página de Envíos.
            No nos hacemos responsables por retrasos atribuibles al operador
            logístico, pero ayudaremos en cualquier seguimiento que se requiera.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">5. Devoluciones</h2>
          <p>
            Aceptamos devoluciones dentro de los 5 días hábiles siguientes a la
            recepción, siempre que el producto esté sin abrir y con su empaque
            original. Por la naturaleza del producto, no se aceptan devoluciones
            de envases abiertos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">6. Uso del sitio</h2>
          <p>
            Te comprometes a usar el sitio de forma lícita, sin intentar
            acceder a áreas restringidas, manipular el funcionamiento técnico ni
            usar los contenidos para fines comerciales sin autorización.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">7. Propiedad intelectual</h2>
          <p>
            El nombre Peptigene, el logo, los textos, las imágenes y el diseño
            del sitio son propiedad de sus autores. No pueden reproducirse sin
            autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">8. Recomendación de uso</h2>
          <p>
            Los suplementos alimentarios complementan una dieta balanceada, no
            la reemplazan. Si tienes alguna condición médica o estás bajo
            tratamiento, consulta con un profesional de la salud antes de
            consumir cualquier suplemento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">9. Ley aplicable</h2>
          <p>
            Esta relación se rige por las leyes de la República de Colombia.
            Cualquier controversia se resolverá ante los jueces competentes del
            domicilio del vendedor.
          </p>
        </section>

        <div className="bg-olive-100 rounded-2xl p-6 mt-12">
          <p className="text-sm text-olive-800">
            <strong>Aviso académico:</strong> Documento ilustrativo, parte de
            un proyecto universitario. No constituye términos legales vinculantes
            ya que Peptigene es una marca ficticia.
          </p>
        </div>
      </div>
    </div>
  );
}
