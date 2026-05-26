import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Peptigene recolecta, usa y protege los datos personales de sus usuarios.",
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Legal</p>
      <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-4">
        Política de privacidad
      </h1>
      <p className="text-sm text-olive-700/70 mb-12">
        Última actualización: {new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-olive max-w-none space-y-8 text-olive-800 leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">1. Quiénes somos</h2>
          <p>
            Peptigene es una marca de suplementos deportivos ficticia, creada como
            proyecto académico. Este documento describe de forma ilustrativa cómo
            una tienda en línea trataría los datos personales de sus usuarios bajo
            el marco legal colombiano (Ley 1581 de 2012 y normas concordantes).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">2. Datos que recolectamos</h2>
          <p>
            Cuando interactúas con el sitio recolectamos únicamente los datos que
            tú nos proporcionas y los necesarios para el funcionamiento técnico de
            la plataforma:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Datos de contacto: nombre, apellido, correo electrónico, teléfono.</li>
            <li>Dirección de envío para la entrega de pedidos.</li>
            <li>Información del pedido: productos seleccionados, fecha y método de pago elegido.</li>
            <li>Datos de navegación: páginas visitadas, tiempo en el sitio, dispositivo y navegador.</li>
          </ul>
          <p className="mt-3">
            No solicitamos ni almacenamos datos sensibles como historia clínica,
            origen étnico, orientación política, religiosa o sindical.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">3. Para qué usamos tus datos</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Procesar y entregar los pedidos que realices.</li>
            <li>Enviarte confirmaciones, actualizaciones de envío y soporte post-venta.</li>
            <li>Mejorar la experiencia del sitio analizando uso de forma agregada.</li>
            <li>Enviarte comunicaciones comerciales únicamente si aceptaste expresamente recibirlas.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">4. Con quién compartimos información</h2>
          <p>
            Compartimos datos únicamente con los proveedores estrictamente
            necesarios para operar: pasarela de pago, operador logístico y
            proveedor de hosting. Cada uno está obligado a tratar la información
            bajo estándares equivalentes a los descritos aquí.
          </p>
          <p className="mt-3">
            No vendemos tus datos a terceros bajo ninguna circunstancia.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">5. Cookies</h2>
          <p>
            Usamos cookies técnicas para mantener tu sesión y el contenido del
            carrito, y cookies analíticas anónimas para entender qué partes del
            sitio funcionan mejor. Puedes desactivarlas desde la configuración de
            tu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">6. Tus derechos</h2>
          <p>Como titular de los datos tienes derecho a:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Conocer qué información tuya tenemos almacenada.</li>
            <li>Solicitar correcciones si está desactualizada o es inexacta.</li>
            <li>Pedir la eliminación de tus datos cuando ya no sean necesarios.</li>
            <li>Revocar la autorización para tratamientos comerciales.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
          </ul>
          <p className="mt-3">
            Para ejercer cualquiera de estos derechos escríbenos a{" "}
            <span className="text-olive-700">privacidad@peptigene.demo</span>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">7. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger
            los datos: cifrado HTTPS en todo el sitio, acceso restringido por
            roles internos y respaldos periódicos. Ningún sistema es 100% seguro,
            pero trabajamos para minimizar riesgos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-olive-900 mb-3">8. Cambios a esta política</h2>
          <p>
            Si modificamos esta política, publicaremos la nueva versión en esta
            página con la fecha de actualización. Los cambios sustanciales se
            notificarán por correo a los usuarios registrados.
          </p>
        </section>

        <div className="bg-olive-100 rounded-2xl p-6 mt-12">
          <p className="text-sm text-olive-800">
            <strong>Aviso académico:</strong> Este documento es ilustrativo, parte
            de un proyecto universitario. No constituye un compromiso legal real
            ya que Peptigene es una marca ficticia.
          </p>
        </div>
      </div>
    </div>
  );
}
