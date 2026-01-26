import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register font for Turkish characters if needed, but standard fonts often handle basic ones.
// For robust Turkish support in production, a custom font registration is recommended.
// Here we use Helvetica which has decent support, or we can use generic fallback.

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 5,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signatureBlock: {
    width: '40%',
    borderTopWidth: 1,
    borderColor: '#000',
    paddingTop: 10,
    textAlign: 'center',
  },
});

interface ContractProps {
  studentName: string;
  date: string;
}

export const ContractDocument = ({ studentName, date }: ContractProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.header}>PORTAL YURTDIŞI EĞİTİM DANIŞMANLIĞI HİZMETİ ANA SÖZLEŞMESİ</Text>
      
      <Text style={styles.paragraph}>Tarih: {date}</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>1. TARAFLAR</Text>
        <Text style={styles.paragraph}>
          İşbu sözleşme; Pazar Camii Mah., Pazar Sok. No 68. Nizip Gaziantep adresinde yer alan “Portal Yurtdışı Eğitim Danışmanlığı” adına yürürlükteki mevzuata göre yetkili Fırat Böler (bundan böyle "Danışman" olarak anılacaktır) ile aşağıda bilgileri yer alan {studentName} (bundan böyle "Öğrenci" olarak anılacaktır) arasında akdedilmiştir.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. KONU</Text>
        <Text style={styles.paragraph}>
          İşbu sözleşmenin konusu, Danışman'ın Öğrenci'ye yurtdışındaki eğitim kurumlarına başvuru, kabul ve kayıt süreçlerinde vereceği danışmanlık hizmetlerinin kapsamının belirlenmesidir.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. HİZMET KAPSAMI</Text>
        <Text style={styles.paragraph}>• Öğrencinin akademik geçmişine uygun üniversite ve program analizi.</Text>
        <Text style={styles.paragraph}>• Başvuru dosyasının hazırlanması, belgelerin kontrolü ve çeviri süreçlerinin yönetimi.</Text>
        <Text style={styles.paragraph}>• Üniversite başvurularının yapılması ve takibi.</Text>
        <Text style={styles.paragraph}>• Kabul mektubunun (Acceptance Letter) temini.</Text>
        <Text style={styles.paragraph}>• Vize başvurusu için gerekli dosyanın hazırlanmasında rehberlik.</Text>
      </View>

       <View style={styles.section}>
        <Text style={styles.heading}>4. ÜCRET VE ÖDEME</Text>
        <Text style={styles.paragraph}>
          Hizmet bedeli taraflarca kararlaştırılan tutar üzerinden ödenecektir. Ödemeler nakit veya banka havalesi yoluyla yapılabilir.
        </Text>
      </View>

       <View style={styles.section}>
        <Text style={styles.heading}>5. CAYMA HAKKI</Text>
        <Text style={styles.paragraph}>
          Öğrenci, hizmet alımından vazgeçmesi durumunda, yapılan masraflar düşüldükten sonra kalan tutarın iadesini talep edebilir. Ancak başvuru yapılmış ve süreç başlamışsa iade yapılmaz.
        </Text>
      </View>

      <View style={styles.signatureRow}>
        <View style={styles.signatureBlock}>
          <Text style={styles.bold}>Danışman</Text>
          <Text>Portal Yurtdışı Eğitim</Text>
          <Text>Fırat Böler</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.bold}>Öğrenci</Text>
          <Text>{studentName}</Text>
          <Text>İmza</Text>
        </View>
      </View>

    </Page>
  </Document>
);
