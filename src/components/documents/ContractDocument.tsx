import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 35,
    paddingBottom: 40,
    fontFamily: 'Roboto',
    fontSize: 9,
    lineHeight: 1.5,
    color: '#000000',
  },
  header: {
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    textDecoration: 'underline',
  },
  heading: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 3,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: 'justify',
    fontSize: 9,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoBox: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: 9,
  },
  infoLine: {
    marginBottom: 2,
  },
  listItem: {
    marginBottom: 2,
    fontSize: 9,
    paddingLeft: 8,
  },
  totalPrice: {
    marginTop: 6,
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'justify',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  signatureBlock: {
    width: '40%',
    textAlign: 'center',
  },
  signatureName: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  signatureRole: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 25,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    borderStyle: 'dashed',
    height: 30,
  },
});

interface ContractProps {
  studentName: string;
  tcNo: string;
  phone: string;
  address: string;
  universityName: string;
  programName: string;
  date: string;
}

export const ContractDocument = ({
  studentName,
  tcNo,
  phone,
  address,
  universityName,
  programName,
  date,
}: ContractProps) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.header}>
        PORTAL YURTDIŞI EĞİTİM DANIŞMANLIĞI HİZMETİ ANA SÖZLEŞMESİ
      </Text>

      <Text style={styles.paragraph}>
        İşbu sözleşme; Pazar Camii Mah., Pazar Sok. No 68. Nizip Gaziantep adresinde yer alan {'"'}Portal Yurtdışı Eğitim Danışmanlığı{'"'} adına yürürlükteki mevzuata göre yetkili Fırat Böler ile aşağıda müşteri olarak kişisel bilgileri yazılı {studentName} adına, kendi aralarında aşağıdaki maddeler çerçevesinde imzalanmış, yurtdışı eğitim danışmanlığı sözleşmesidir.
      </Text>

      <View style={styles.infoBox} wrap={false}>
        <Text style={styles.infoLine}><Text style={styles.bold}>Müşterinin: </Text>{studentName}</Text>
        <Text style={styles.infoLine}><Text style={styles.bold}>T.C. Kimlik Numarası: </Text>{tcNo}</Text>
        <Text style={styles.infoLine}><Text style={styles.bold}>Telefonu: </Text>{phone}</Text>
        <Text style={styles.infoLine}><Text style={styles.bold}>Adresi: </Text>{address}</Text>
        <Text style={styles.infoLine}><Text style={styles.bold}>Talep Ettiği Üniversite ve Bölümü: </Text>{universityName} - {programName}</Text>
      </View>

      <Text style={styles.paragraph}>
        Sözleşmede, {'"'}Portal Yurtdışı Eğitim Danışmanlığı{'"'} bundan sonra {'"'}Danışman{'"'}, {studentName} ise {'"'}Müşteri{'"'} olarak anılacaktır.
      </Text>

      <Text style={styles.heading}>A- SÖZLEŞME KONUSU VE AMACI</Text>
      <Text style={styles.paragraph}>
        İşbu sözleşmenin konusu, Müşterinin talep etmiş olduğu hizmet alanlarında yurtdışı eğitim danışmanlığı hizmetinin verilmesidir. Danışman; İşbu sözleşme ve varsa eklerinde belirtildiği şekilde ve zamanında taahhüt ettiği işi yerine getirmekle yükümlüdür. Müşteri ise yapılan işin bedelini, ilgili maddelerde belirtilen şekilde ve miktarda ödemek, Portal Yurtdışı Eğitim Danışmanlığı tarafından kendisinden istenen evrakları, dökümanları ve belgeleri sağlamakla yükümlüdür.
      </Text>
      <Text style={styles.paragraph}>
        İşbu anlaşmanın amacı; Danışman tarafından, bünyesinde bulunan tercüman, danışman veya sözleşmeli olduğu danışmanlar aracılığı ile Şirket Ana Sözleşmesi{"'"}nde belirtilen konularda ve bu sözleşme ile sınırlandırılmış alanlarda, müşterinin menfaatlerini gözeterek, Rusya Federasyonu sınırları içerisindeki üniversitelere kaydının yapılması konusunda aracılık ve eğitim danışmanlığı hizmetinin verilmesidir.
      </Text>

      <Text style={styles.heading}>B- ANLAŞMA MADDELERİ</Text>
      <Text style={styles.paragraph}>
        İşbu anlaşma kapsamında, danışmanın görevi, Rusya Federasyonu sınırları içindeki üniversitelere kaydının yapılması konusunda bünyesinde bulunan danışmanlar veya sözleşmeli olduğu danışmanlar ile müşteriye danışmanlık ve aracılık hizmetleri vermek ve bu konuda gerekli işlemlerin yapılmasını sağlamaktır.
      </Text>
      <Text style={styles.paragraph}>
        İşbu anlaşma uyarınca, danışman taahhüt ettiği işleri, anlaşma süresi içinde ya da tarafların aşağıda belirtilen protokolle belirleyecekleri süre içinde tamamlamayı taahhüt eder.
      </Text>
      <Text style={styles.paragraph}>
        Danışman, Rusya Federasyonu sınırları içindeki üniversitelerin öğrenci kayıt şartları, bu üniversitelerin eğitim-öğretim imkanları ve şayet işbu sözleşme kapsamında müşterinin bir üniversiteye kaydının yapılması durumunda müşterinin öğrenime başlayıp devam edebilmesi konularında müşteriye eğitim danışmanlığı yapmakla yükümlüdür. Eğitim danışmanı, kendi ana sözleşmesinde geçmeyen alanlarda danışmanlık yapamaz.
      </Text>

      <Text style={styles.heading}>C- TARAFLARIN HAK VE YÜKÜMLÜLÜKLERİ</Text>
      <Text style={styles.paragraph}>
        Müşteri ve Danışman her türlü yasal denetimden, cezadan, vergi/resim/harçlardan vb. giderlerden kendileri adına sorumlu olup her türlü kanuni sorumluluk kendilerine aittir. Tarafların belirtilen konudaki {'"'}Hak ve Yükümlülükleri{'"'} karşılıklı olarak bu sözleşme ile sınırlandırılmıştır.
      </Text>
      <Text style={styles.paragraph}>
        İşbu anlaşma doğrultusunda yerine getirilmeyen yükümlülükler için kusurlu taraf, sözleşmeye aykırı eylemlerinden kaynaklanan tüm masrafları ile birlikte kusuru sebebiyle meydana gelen kazanç kayıplarını da tazminat olarak ödemekle yükümlüdür.
      </Text>

      <Text style={styles.heading}>D- EĞİTİM DANIŞMANININ YÜKÜMLÜLÜKLERİ</Text>
      <Text style={styles.paragraph}>
        Danışman, Rusya Federasyonu sınırları içerisinde yer alan üniversitelerin kayıt şartları ve eğitim öğretim imkanları hakkında bilgilendirme ve yurtdışı eğitim danışmanlığı hizmetleri konusunda müşteriye eksiksiz ve işbu anlaşma şartlarına uygun olarak bilgi vermek ve danışmanlık yapmakla yükümlüdür.
      </Text>
      <Text style={styles.paragraph}>
        Danışman, müşterinin, belirtilen eğitim kurumlarına kayıt olabilmesi ve eğitim imkanlarından faydalanabilmesi için gerekli tüm evrakları müşterinin taleplerine uygun olarak temin etmek (Başvuru evrakları, okul kaydı için gerekli formlar vb.) ve bu evrakların doldurulup gerekli başvuruların yapılması konusunda müşteriye aracılık ve danışmanlık yapmakla yükümlüdür.
      </Text>

      <Text style={styles.heading}>E- MÜŞTERİNİN YÜKÜMLÜLÜKLERİ</Text>
      <Text style={styles.paragraph}>
        Müşteri, sözleşme kapsamındaki Zorunlu Masraflar ve Ön Danışmanlık Hizmeti Ücreti ile Eğitim Danışmanlığı Ücretini işbu sözleşmesinde belirtildiği şekliyle ödemekle yükümlüdür. Müşteri, danışmanın anlaşma şartlarına uygun olarak verdiği ve vereceği danışmanlık hizmetlerini, belirtilen zaman ve yerde, verilen tüm dokümanlarla birlikte kabul etmek ve eğitim danışmanının danışmanlık konusundaki talimatlara uymakla yükümlüdür.
      </Text>

      <Text style={styles.heading}>F- ÖDEME ŞEKLİ VE MİKTARI</Text>
      <Text style={styles.paragraph}>
        Eğitim danışmanlığı hizmeti aşağıdaki hizmetleri kapsamaktadır:
      </Text>
      <Text style={styles.listItem}>• Gerekli belgelerin Rusça{"'"}ya noter onaylı çevirisi</Text>
      <Text style={styles.listItem}>• Vize almak için gelecek davetiyenin harç ve ulaşım bedeli</Text>
      <Text style={styles.listItem}>• Vize takip işlemlerinin yapılması, vizenin alınması ve vizenin uzatılması</Text>
      <Text style={styles.listItem}>• Türkiye kalkışlı Rusya Federasyonu{"'"}na uçak ile seyahat bedeli (Fazladan valiz hakkını öğrenci öder)</Text>
      <Text style={styles.listItem}>• Havalimanında karşılama ve havalimanından transfer</Text>
      <Text style={styles.listItem}>• Rusya{"'"}ya ilk varış sonrası müşterinin otelde veya paylaşımlı evde 3 gün konaklama masrafı</Text>
      <Text style={styles.listItem}>• Oturma izni masrafları, Öğrenci yurduna kayıt işlemleri</Text>
      <Text style={styles.listItem}>• 1 akademik yıl süresince müşterinin üniversite yurdunda konaklama ücreti</Text>
      <Text style={styles.listItem}>• 1 yıl zorunlu sağlık sigortası ücreti</Text>
      <Text style={styles.listItem}>• Rusya Federasyonu{"'"}nda bir akademik yıllık oturum izni</Text>
      <Text style={styles.listItem}>• Rusya Federasyonu{"'"}nda kullanılabilecek bir adet mobil GSM hattı</Text>
      <Text style={styles.listItem}>• 1 Akademik yıllık danışmanlık hizmeti</Text>

      <Text style={styles.totalPrice}>
        İşbu sözleşme kapsamında müşterinin (öğrencinin) ödeyeceği toplam hizmet bedeli 6.500 Amerikan Doları (USD){"'"}dır.
      </Text>

      <View wrap={false}>
        <Text style={styles.heading}>G- ANLAŞMANIN SÜRESİ VE İMZA</Text>
        <Text style={styles.paragraph}>
          İşbu sözleşme, taraflara birer tane olmak üzere, her biri aynı hukuki statüye sahip iki nüsha halinde hazırlanmıştır. {date} tarihinde imzalanmış ve yürürlüğe girmiştir.
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>{studentName}</Text>
            <Text style={styles.signatureRole}>Müşteri</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>Fırat Böler</Text>
            <Text style={styles.signatureRole}>Portal Yurtdışı Eğitim Danışmanlığı</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
