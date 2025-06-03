import 'iranianbanklogos/dist/ibl.css';

const BankIconDetector = ({ bankName, className }: { bankName: string; className?: string }) => {
  // List of Iranian banks
  const banks = {
    SADERAT: ['saderat', 'صادرات'],
    TOSE: ['توسعه', 'توسعه صنعت', 'توسعه صنعت و معادن'],
    MELLI: ['melli', 'ملی', 'ملی ایران'],
    ANSAR: ['ansar', 'انصار'],
    REFAH: ['refah', 'رفاه', 'رفاه کارگران'],
    MASKAN: ['maskan', 'مسکن'],
    PARSIAN: ['parsian', 'پارسیان'],
    KESHAVARZI: ['keshavarzi', 'کشاورزی'],
    SEPAH: ['sepah', 'سپه'],
    TEJARAT: ['tejarat', 'تجارت'],
    MELLAT: ['mellat', 'ملت'],
    SHAHR: ['shahr', 'شهر'],
    SAMAN: ['saman', 'سامان'],
    GHAVAMIN: ['ghavamin', 'قوامین'],
    PASARGAD: ['pasargad', 'پاسارگاد'],
    SINA: ['sina', 'سینا'],
    SARMAYEH: ['sarmayeh', 'سرمایه'],
    EGHTESAD_NOVIN: ['eghtesad', 'اقتصاد', 'اقتصاد نوین'],
    RESALAT: ['resalat', 'رسالت'],
    GARDESHGARI: ['gardeshgari', 'گردشگری'],
    KARAFARIN: ['karafarin', 'کارآفرین'],
    AYANDEH: ['ayandeh', 'آینده'],
    DEY: ['dey', 'دی'],
    MEHR_IRAN: ['mehr', 'مهر', 'مهر ایران'],
    KHAVARMIANEH: ['khavarmianeh', 'خاورمیانه']
  };

  // Bank icon class mappings
  const bankIconClasses: { [key: string]: string } = {
    SADERAT: 'ibl64 ibl-bsi',
    TOSE: 'ibl64 ibl-tt',
    REFAH: 'ibl64 ibl-rb2',
    MASKAN: 'ibl64 ibl-maskan',
    PARSIAN: 'ibl64 ibl-parsian',
    KESHAVARZI: 'ibl64 ibl-bki',
    SEPAH: 'ibl64 ibl-sepah',
    MELLI: 'ibl64 ibl-bmi',
    TEJARAT: 'ibl64 ibl-tejarat',
    MELLAT: 'ibl64 ibl-mellat',
    SHAHR: 'ibl64 ibl-shahr',
    SAMAN: 'ibl64 ibl-sb',
    GHAVAMIN: 'ibl64 ibl-ghbi',
    PASARGAD: 'ibl64 ibl-bpi',
    SINA: 'ibl64 ibl-sina',
    SARMAYEH: 'ibl64 ibl-sarmayeh',
    ANSAR: 'ibl64 ibl-ansar',
    EGHTESAD_NOVIN: 'ibl64 ibl-en',
    RESALAT: 'ibl64 ibl-resalat',
    GARDESHGARI: 'ibl64 ibl-tourism',
    KARAFARIN: 'ibl64 ibl-kar',
    AYANDEH: 'ibl64 ibl-ba',
    DEY: 'ibl64 ibl-day',
    MEHR_IRAN: 'ibl64 ibl-miran',
    KHAVARMIANEH: 'ibl64 ibl-me'
  };

  const detectBank = (input: string): string | null => {
    // Return null if input is empty or just whitespace
    if (!input || !input.trim()) {
      return null;
    }

    const normalizedInput = input.toLowerCase().trim();

    for (const [bankKey, keywords] of Object.entries(banks)) {
      if (keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(normalizedInput))) {
        return bankKey;
      }
    }

    return null;
  };

  const detectedBank = detectBank(bankName);

  return <div className={className}>{detectedBank ? <i className={bankIconClasses[detectedBank]}></i> : ''}</div>;
};

export default BankIconDetector;
