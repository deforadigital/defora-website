import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Defora Digital",
  description:
    "Defora Digital kişisel verilerin işlenmesine yönelik KVKK aydınlatma metni.",
};

export default function KvkkAydinlatmaMetniPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101f] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/brand/defora-abstract-bg.svg')] bg-cover bg-[56%_46%] opacity-40 saturate-[0.68] contrast-[1.08]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(3,8,18,0.92)_0%,rgba(7,16,31,0.82)_42%,rgba(6,10,18,0.92)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[46rem] px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-[0.8rem] font-medium uppercase tracking-[0.16em] text-white/50 transition hover:text-white/80"
        >
          ← Defora Digital
        </Link>

        <h1 className="mt-8 text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-white">
          Kişisel Verilerin İşlenmesine Yönelik Aydınlatma Metni
        </h1>

        <div className="mt-10 space-y-8 text-[0.98rem] leading-[1.8] text-white/72">
          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              1. Veri Sorumlusunun Kimliği ve Giriş
            </h2>
            <p className="mt-3">
              Kişisel Verilerin İşlenmesine Yönelik Aydınlatma Metni (&quot;Aydınlatma
              Metni&quot;) ile Kızılarık Mah. Kızılırmak Cad. Argın İş Merkezi No: 80
              İç Kapı No: 103 Muratpaşa / Antalya adresinde mukim, Antalya Kurumlar
              Vergi Dairesi&apos;ne 2721231290 numarası ile kayıtlı ve
              0272123129000001 MERSİS numaralı Defora Teknoloji Ödeme Sistemleri
              Sanayi Turizm ve Ticaret Limited Şirketi (&quot;Defora Digital&quot;)
              olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
              uyarınca, Veri Sorumlusu sıfatıyla, sizi KVKK kapsamındaki aydınlatma
              yükümlülüğümüz çerçevesinde bilgilendirmek istiyoruz.
            </p>
            <p className="mt-3">
              KVKK kapsamında kişisel veri; kimliği belirli veya belirlenebilir
              gerçek kişiye ilişkin her türlü bilgiyi ifade eder. Defora Digital,
              tüm kişisel veri işleme faaliyetlerinde KVKK başta olmak üzere ilgili
              mevzuata tam uyumla hareket etmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              2. Kişisel Veri Toplama Yöntemleri ve Hukuki Sebepler
            </h2>
            <p className="mt-3">
              Kişisel verileriniz, Defora Digital tarafından otomatik veya otomatik
              olmayan yollarla, yazılı veya elektronik şekilde aşağıdaki kanallar
              vasıtasıyla toplanmaktadır:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Web Sitesi Araçları: defora.digital üzerinde sunulan ücretsiz analiz
                araçlarının (web sitesi analizi, backlink bulucu, reklam analizi
                vb.) kullanımı sırasında doldurulan formlar,
              </li>
              <li>
                İletişim Kanalları: E-posta yazışmaları ve WhatsApp destek hattımız
                (0540 033 36 72) üzerinden yürütülen görüşmeler.
              </li>
            </ul>
            <p className="mt-3">
              Bu kişisel veriler; KVKK Madde 5.1 (Açık Rıza) ve Madde 5.2
              (sözleşmenin kurulması/ifası, hukuki yükümlülüklerin yerine
              getirilmesi, meşru menfaatler) kapsamında hukuka uygun olarak
              işlenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              3. İşlenen Kişisel Veri Grupları
            </h2>
            <p className="mt-3">
              Defora Digital tarafından işlenen kişisel verileriniz aşağıda
              belirtilmiştir:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Kimlik ve İletişim Bilgileri: Ad, soyad ve cep telefonu numarası,</li>
              <li>
                Kullanım Bilgileri: Analiz talep edilen web sitesi adresi ve araç
                kullanım zamanı,
              </li>
              <li>Teknik Bilgiler: IP adresi ve tarayıcı türü gibi teknik veriler.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              4. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <p className="mt-3">
              Toplanan kişisel verileriniz aşağıdaki amaçlar dahilinde
              işlenmektedir:
            </p>
            <p className="mt-4 font-medium text-white/90">
              Açık Rıza Şartı Aranmaksızın (KVKK Md. 5.2):
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Talep ettiğiniz ücretsiz analiz sonucunun tarafınıza iletilmesi,</li>
              <li>Destek taleplerinizin ve sorularınızın yanıtlanması,</li>
              <li>
                Yasal yükümlülüklerin yerine getirilmesi ve resmi kurumların
                taleplerine yanıt verilmesi.
              </li>
            </ul>
            <p className="mt-4 font-medium text-white/90">
              Açık Rızanızın Varlığı Halinde (KVKK Md. 5.1):
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Dijital pazarlama, web tasarımı ve ilgili hizmetlerimize dair
                bilgilendirme ve teklif sunulması,
              </li>
              <li>SMS veya WhatsApp aracılığıyla iletişim kurulması.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              5. Kişisel Verilerin Saklanma Süresi
            </h2>
            <p className="mt-3">
              Kişisel verileriniz, işbu Aydınlatma Metni&apos;nde belirtilen amaçlar
              ortadan kalkmadığı müddetçe ve yasal saklama sürelerine uygun olarak
              muhafaza edilecektir. Ticari iletişim onaylarına ilişkin kayıtlar 1
              yıl, iletişim kayıtları ise 3 yıl süreyle saklanır. Süreler
              dolduğunda verileriniz güvenle silinir, yok edilir veya anonim hale
              getirilir.
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              6. Kişisel Verilerin Üçüncü Kişilere Aktarılması
            </h2>
            <p className="mt-3">
              Defora Digital, toplanan kişisel verileri yalnızca belirtilen
              amaçlarla sınırlı olmak kaydıyla aşağıdaki taraflara aktarabilir:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Teknik Altyapı: Sunucu barındırma ve SMS bildirim hizmetleri için
                çalıştığımız iş ortakları (NetGSM),
              </li>
              <li>
                Resmi Makamlar: Yasal yükümlülüklerimiz kapsamında yetkili adli ve
                idari kamu kurum ve kuruluşları.
              </li>
            </ul>
            <p className="mt-3">
              Kişisel verileriniz, yukarıda belirtilen amaçlar ve aktarım şartları
              dışında herhangi bir üçüncü kişiyle paylaşılmaz, satılmaz veya
              kiralanmaz.
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-medium text-white">
              7. Kişisel Verilerinize Erişim ve KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="mt-3">
              KVKK Madde 11 uyarınca, Defora Digital&apos;e başvurarak kişisel
              verilerinizin;
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>İşlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>
                İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
                öğrenme,
              </li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>
                Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,
              </li>
              <li>
                İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde
                silinmesini veya yok edilmesini isteme,
              </li>
              <li>
                Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın
                giderilmesini talep etme
              </li>
            </ul>
            <p className="mt-3">haklarına sahipsiniz.</p>
            <p className="mt-4">Taleplerinizi aşağıdaki kanallardan iletebilirsiniz:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>E-posta: contact@deforadigital.com</li>
              <li>KEP: deforteknoloji@hs01.kep.tr</li>
              <li>
                Posta: Kızılarık Mah. Kızılırmak Cad. Argın İş Merkezi No: 80 İç
                Kapı No: 103 Muratpaşa / Antalya
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
