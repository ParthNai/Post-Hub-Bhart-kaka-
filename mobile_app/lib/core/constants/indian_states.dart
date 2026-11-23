/// Indian State and Union Territory entity with trilingual localized names.
class IndianState {
  const IndianState({
    required this.code,
    required this.nameEn,
    required this.nameGu,
    required this.nameHi,
    this.isUnionTerritory = false,
  });

  final String code;
  final String nameEn;
  final String nameGu;
  final String nameHi;
  final bool isUnionTerritory;

  String localizedName(String langCode) {
    if (langCode == 'gu') return nameGu;
    if (langCode == 'hi') return nameHi;
    return nameEn;
  }
}

/// Complete list of Indian States and Union Territories for Panchayat Post.
class IndianStatesData {
  IndianStatesData._();

  static const List<IndianState> allStates = [
    // States
    IndianState(code: 'AP', nameEn: 'Andhra Pradesh', nameGu: 'આંધ્ર પ્રદેશ', nameHi: 'आंध्र प्रदेश'),
    IndianState(code: 'AR', nameEn: 'Arunachal Pradesh', nameGu: 'અરુણાચલ પ્રદેશ', nameHi: 'अरुणाचल प्रदेश'),
    IndianState(code: 'AS', nameEn: 'Assam', nameGu: 'અસમ', nameHi: 'असम'),
    IndianState(code: 'BR', nameEn: 'Bihar', nameGu: 'બિહાર', nameHi: 'बिहार'),
    IndianState(code: 'CG', nameEn: 'Chhattisgarh', nameGu: 'છત્તીસગઢ', nameHi: 'छत्तीसगढ़'),
    IndianState(code: 'GA', nameEn: 'Goa', nameGu: 'ગોવા', nameHi: 'गोवा'),
    IndianState(code: 'GJ', nameEn: 'Gujarat', nameGu: 'ગુજરાત', nameHi: 'गुजरात'),
    IndianState(code: 'HR', nameEn: 'Haryana', nameGu: 'હરિયાણા', nameHi: 'हरियाणा'),
    IndianState(code: 'HP', nameEn: 'Himachal Pradesh', nameGu: 'હિમાચલ પ્રદેશ', nameHi: 'हिमाचल प्रदेश'),
    IndianState(code: 'JH', nameEn: 'Jharkhand', nameGu: 'ઝારખંડ', nameHi: 'झारखंड'),
    IndianState(code: 'KA', nameEn: 'Karnataka', nameGu: 'કર્ણાટક', nameHi: 'कर्नाटक'),
    IndianState(code: 'KL', nameEn: 'Kerala', nameGu: 'કેરળ', nameHi: 'केरल'),
    IndianState(code: 'MP', nameEn: 'Madhya Pradesh', nameGu: 'મધ્ય પ્રદેશ', nameHi: 'मध्य प्रदेश'),
    IndianState(code: 'MH', nameEn: 'Maharashtra', nameGu: 'મહારાષ્ટ્ર', nameHi: 'महाराष्ट्र'),
    IndianState(code: 'MN', nameEn: 'Manipur', nameGu: 'મણિપુર', nameHi: 'मणिपुर'),
    IndianState(code: 'ML', nameEn: 'Meghalaya', nameGu: 'મેઘાલય', nameHi: 'मेघालय'),
    IndianState(code: 'MZ', nameEn: 'Mizoram', nameGu: 'મિઝોરમ', nameHi: 'मिजोरम'),
    IndianState(code: 'NL', nameEn: 'Nagaland', nameGu: 'નાગાલેન્ડ', nameHi: 'नागालैंड'),
    IndianState(code: 'OD', nameEn: 'Odisha', nameGu: 'ઓડિશા', nameHi: 'ओडिशा'),
    IndianState(code: 'PB', nameEn: 'Punjab', nameGu: 'પંજાબ', nameHi: 'पंजाब'),
    IndianState(code: 'RJ', nameEn: 'Rajasthan', nameGu: 'રાજસ્થાન', nameHi: 'राजस्थान'),
    IndianState(code: 'SK', nameEn: 'Sikkim', nameGu: 'સિક્કિમ', nameHi: 'सिक्किम'),
    IndianState(code: 'TN', nameEn: 'Tamil Nadu', nameGu: 'તમિલનાડુ', nameHi: 'तमिलनाडु'),
    IndianState(code: 'TS', nameEn: 'Telangana', nameGu: 'તેલંગાણા', nameHi: 'तेलंगाना'),
    IndianState(code: 'TR', nameEn: 'Tripura', nameGu: 'ત્રિપુરા', nameHi: 'त्रिपुरा'),
    IndianState(code: 'UP', nameEn: 'Uttar Pradesh', nameGu: 'ઉત્તર પ્રદેશ', nameHi: 'उत्तर प्रदेश'),
    IndianState(code: 'UK', nameEn: 'Uttarakhand', nameGu: 'ઉત્તરાખંડ', nameHi: 'उत्तराखंड'),
    IndianState(code: 'WB', nameEn: 'West Bengal', nameGu: 'પશ્ચિમ બંગાળ', nameHi: 'पश्चिम बंगाल'),

    // Union Territories
    IndianState(code: 'AN', nameEn: 'Andaman and Nicobar Islands', nameGu: 'અંદમાન અને નિકોબાર દ્વીપસમૂહ', nameHi: 'अंडमान और निकोबार द्वीप समूह', isUnionTerritory: true),
    IndianState(code: 'CH', nameEn: 'Chandigarh', nameGu: 'ચંદીગઢ', nameHi: 'चंडीगढ़', isUnionTerritory: true),
    IndianState(code: 'DN', nameEn: 'Dadra and Nagar Haveli and Daman and Diu', nameGu: 'દાદરા અને નગર હવેલી અને દમણ અને દીવ', nameHi: 'दादरा और नगर हवेली और दमन और दीव', isUnionTerritory: true),
    IndianState(code: 'DL', nameEn: 'Delhi (NCT)', nameGu: 'દિલ્હી', nameHi: 'दिल्ली', isUnionTerritory: true),
    IndianState(code: 'JK', nameEn: 'Jammu and Kashmir', nameGu: 'જમ્મુ અને કાશ્મીર', nameHi: 'जम्मू और कश्मीर', isUnionTerritory: true),
    IndianState(code: 'LA', nameEn: 'Ladakh', nameGu: 'લદ્દાખ', nameHi: 'लद्दाख', isUnionTerritory: true),
    IndianState(code: 'LD', nameEn: 'Lakshadweep', nameGu: 'લક્ષદ્વીપ', nameHi: 'लक्षद्वीप', isUnionTerritory: true),
    IndianState(code: 'PY', nameEn: 'Puducherry', nameGu: 'પુડુચેરી', nameHi: 'पुडुचेरी', isUnionTerritory: true),
  ];
}
