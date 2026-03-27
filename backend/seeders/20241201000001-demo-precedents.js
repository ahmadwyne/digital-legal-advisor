'use strict';
const { v4: uuidv4 } = require('uuid');

/**
 * Demo Precedents Seeder
 * Based on Pakistani Supreme Court / High Court case patterns.
 * Replace `content` with actual HuggingFace dataset content when integrated.
 *
 * Dataset reference:
 *   https://huggingface.co/datasets/Ibtehaj10/supreme-court-of-pak-judgments
 */

const PRECEDENTS = [
  {
    id: uuidv4(),
    title: 'Mst. Kosar Mai vs SHO etc.',
    citation: 'Crl. Revision 21000/24',
    caseNo: 'Crl. Revision 21000/24',
    court: 'Lahore High Court',
    judge: 'Mr. Justice Anwaarul Haq Pannun',
    year: 2024,
    keywords: JSON.stringify(['criminal revision', 'SHO', 'FIR', 'habeas corpus']),
    summary: 'Criminal revision petition challenging the order of the learned Sessions Judge. The petitioner sought interference in the matter of registration of FIR and police inaction.',
    content: `JUDGMENT

In the Court of Lahore High Court, Lahore
Criminal Revision No. 21000 of 2024

Mst. Kosar Mai                    ...Petitioner
vs
SHO and others                    ...Respondents

Date of Hearing: 2024
Decided on: 2024

CORAM: Mr. Justice Anwaarul Haq Pannun

JUDGMENT

This criminal revision has been filed against the order passed by the learned Additional Sessions Judge whereby the revision against the order of the learned Judicial Magistrate was dismissed.

The brief facts of the case are that the petitioner Mst. Kosar Mai filed an application before the learned Magistrate for registration of FIR against the respondents alleging that the respondents had committed offences punishable under sections 337-A(i), 337-F(v), 148, 149 PPC. The application was dismissed.

HELD: The police is bound under the law to register an FIR upon receipt of information regarding a cognizable offence. The discretion of the police officer to conduct a preliminary inquiry is limited to cases specified under Section 154 CrPC as amended. Any delay or refusal in registration of FIR amounts to dereliction of duty and interference by the courts is warranted in such cases.

The revision is accepted. The respondent SHO is directed to register the FIR within 24 hours of receipt of this order.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Corpus 2446-H-20 – Mst. Kosar Mai vs SHO (Habeas Corpus)',
    citation: 'Crl. Misc. Habeas Corpus 2446-H-2020',
    caseNo: 'Crl. Misc.-Habeas Corpus 2446-H-20',
    court: 'Lahore High Court',
    judge: 'Mr. Justice Anwaarul Haq Pannun',
    year: 2020,
    keywords: JSON.stringify(['habeas corpus', 'unlawful detention', 'fundamental rights', 'Article 9']),
    summary: 'Habeas corpus petition filed on behalf of the detainee alleging unlawful detention by the police. The court examined whether the detention violated fundamental rights under Article 9 of the Constitution of Pakistan.',
    content: `JUDGMENT

In the Court of Lahore High Court, Lahore
Criminal Miscellaneous (Habeas Corpus) No. 2446-H of 2020

Mst. Kosar Mai (on behalf of detainee)   ...Petitioner
vs
SHO and others                           ...Respondents

CORAM: Mr. Justice Anwaarul Haq Pannun

JUDGMENT

The instant habeas corpus petition has been filed under Article 199 of the Constitution of Pakistan, 1973 seeking release of the detainee who is allegedly being held in unlawful custody.

LEGAL FRAMEWORK: Article 9 of the Constitution guarantees that no person shall be deprived of life or liberty save in accordance with law. Section 491 CrPC provides remedy of habeas corpus to any person illegally or improperly detained.

FINDINGS: Upon examination, it was found that the detainee was held for a period exceeding 24 hours without being produced before a magistrate, in clear violation of Article 10(1) of the Constitution. The police failed to show any lawful authority for continued detention.

HELD: The detention is declared illegal. The respondents are directed to release the detainee forthwith unless required in any other lawful custody. The SHO concerned is warned that future violations of constitutional rights of citizens will be viewed seriously.

Petition is allowed.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Waseem vs The State',
    citation: 'Crl. Misc. 63668/24',
    caseNo: 'Crl. Misc. 63668/24',
    court: 'Lahore High Court',
    judge: 'Mr. Justice Shakil Ahmad',
    year: 2024,
    keywords: JSON.stringify(['bail', 'criminal miscellaneous', 'pre-arrest bail', 'Section 497 CrPC']),
    summary: 'Application for pre-arrest bail filed by the petitioner apprehending arrest in a case registered under various sections of the PPC. The court examined the principles governing grant of pre-arrest bail.',
    content: `JUDGMENT

In the Court of Lahore High Court, Lahore
Criminal Miscellaneous No. 63668 of 2024

Waseem                    ...Petitioner
vs
The State etc.            ...Respondents

CORAM: Mr. Justice Shakil Ahmad

JUDGMENT

Through the instant petition, the petitioner Waseem seeks pre-arrest bail in case FIR No. ___ registered at Police Station ___ under Sections 302, 324, 148, 149 PPC.

PRINCIPLES OF PRE-ARREST BAIL: The superior courts have consistently held that pre-arrest bail is an extraordinary relief and should only be granted when a prima facie case of mala fide on the part of the police is made out, or where there is an apprehension that the accused will be subjected to oppressive treatment. Reference: PLD 2022 Supreme Court 361.

ANALYSIS: The case involves a dispute of civil nature which has been given a criminal color. The petitioner has been falsely implicated. The FIR was lodged with considerable delay without any plausible explanation.

HELD: Taking into consideration the facts and circumstances of the case, particularly the civil nature of the dispute, the petitioner is admitted to pre-arrest bail subject to furnishing surety bonds in the sum of Rs. 200,000/- with one surety in the like amount to the satisfaction of the learned Trial Court.

Petition is allowed subject to above conditions.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Muhammad Arshad etc. vs The State',
    citation: 'Jail Appeal 24464/21',
    caseNo: 'Jail Appeal 24464/21',
    court: 'Lahore High Court',
    judge: 'Mr. Justice Shakil Ahmad',
    year: 2021,
    keywords: JSON.stringify(['jail appeal', 'murder', 'qatl-e-amd', 'Section 302 PPC', 'evidence', 'eyewitness']),
    summary: 'Jail appeal against conviction and sentence of death under Section 302(b) PPC. The court re-examined the prosecution evidence, eyewitness testimony, and medico-legal aspects of the case.',
    content: `JUDGMENT

In the Court of Lahore High Court, Lahore
Jail Criminal Appeal No. 24464 of 2021

Muhammad Arshad etc.         ...Appellants
vs
The State                    ...Respondent

CORAM: Mr. Justice Shakil Ahmad

JUDGMENT

The appellants have filed this jail appeal against the judgment of the learned Additional Sessions Judge whereby they were convicted under Section 302(b) PPC and sentenced to death with fine.

PROSECUTION CASE: According to the prosecution, the appellants committed qatl-e-amd of the deceased in furtherance of their common intention. The case rests primarily upon the ocular account of two eye-witnesses (PWs 3 and 4) and the medical evidence.

EXAMINATION OF EVIDENCE:

1. OCULAR ACCOUNT: The eye-witnesses are natural witnesses being the brother and neighbor of the deceased. Their presence at the spot is plausible. Minor contradictions in their statements go to the root of the matter and are sufficient to cause doubt.

2. MEDICAL EVIDENCE: The medical evidence fully corroborates the ocular account regarding the nature, seat, and direction of injuries.

3. MOTIVE: The prosecution has established a strong motive involving a property dispute.

HELD: After careful analysis, the prosecution has proved its case beyond reasonable doubt. However, considering the background of the case and previous enmity, the death sentence is converted to imprisonment for life under Section 302(b) PPC. The benefit of Section 382-B CrPC is extended.

Appeal is partially allowed.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Pakistan Tobacco Company vs Commissioner Inland Revenue',
    citation: 'ITA No. 156/KB/2019',
    caseNo: 'ITA No. 156/KB/2019',
    court: 'Income Tax Appellate Tribunal, Karachi',
    judge: 'Honorable Bench',
    year: 2019,
    keywords: JSON.stringify(['income tax', 'withholding tax', 'corporate', 'inland revenue', 'FBR']),
    summary: 'Income tax appeal challenging the order of the Commissioner Inland Revenue (Appeals) upholding additions made to the declared income of the appellant on account of inadmissible deductions and withholding tax defaults.',
    content: `JUDGMENT

Income Tax Appellate Tribunal
Karachi Bench
ITA No. 156/KB/2019 (Tax Year 2016)

Pakistan Tobacco Company Ltd.         ...Appellant
vs
Commissioner Inland Revenue           ...Respondent

JUDGMENT

This appeal is directed against the order of CIR(A) Karachi for tax year 2016.

GROUNDS OF APPEAL:

1. The learned CIR(A) erred in upholding the addition of Rs. 45,000,000/- on account of inadmissible deductions under Section 21 of the Income Tax Ordinance, 2001.

2. The department erred in treating payments to non-residents without deduction of withholding tax under Section 152.

LEGAL ANALYSIS:

Section 21(c) of the Income Tax Ordinance, 2001 disallows deductions for payments where withholding tax has not been collected. However, where the recipient has paid the due tax and filed returns, the deduction cannot be disallowed mechanically.

The Supreme Court in CIT vs. Eli Lilly (2018 SCMR 1234) held that the purpose of withholding tax provisions is collection of revenue and where the ultimate tax liability has been discharged, addition under Section 21(c) is not justified.

HELD: The additions are deleted. The appeal is allowed in terms of the ratio laid down by the Superior Courts. Tax department is directed to issue amended assessment order.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Sui Northern Gas Pipelines Ltd. vs National Industrial Relations Commission',
    citation: 'W.P. No. 45678/2022',
    caseNo: 'W.P. No. 45678/2022',
    court: 'Islamabad High Court',
    judge: 'Mr. Justice Mohsin Akhtar Kayani',
    year: 2022,
    keywords: JSON.stringify(['labor law', 'industrial relations', 'unfair labor practice', 'NIRC', 'employment']),
    summary: 'Writ petition challenging the order of the National Industrial Relations Commission (NIRC) declaring the termination of the respondent-workers as unfair labor practice under the Industrial Relations Act 2012.',
    content: `JUDGMENT

In the Islamabad High Court
Writ Petition No. 45678 of 2022

Sui Northern Gas Pipelines Ltd.             ...Petitioner
vs
NIRC and Workers Union etc.                 ...Respondents

CORAM: Mr. Justice Mohsin Akhtar Kayani

JUDGMENT

The petitioner challenges the order of NIRC whereby the termination of 23 daily-wage workers was declared an unfair labor practice.

STATUTORY FRAMEWORK: Section 31 of the Industrial Relations Act, 2012 defines unfair labor practices by employers. Mass termination during collective bargaining negotiations raises a rebuttable presumption of union-busting activity.

FINDINGS:

1. The terminations occurred within 3 days of the workers submitting a charter of demands, creating a direct nexus.

2. The petitioner failed to demonstrate any genuine economic exigency or performance-based reason for the terminations.

3. The NIRC correctly applied the principle that the burden of proof in unfair labor practice cases shifts to the employer once a prima facie connection between protected activity and adverse employment action is established.

HELD: The writ petition is dismissed. The order of NIRC is upheld. The petitioner is directed to reinstate the terminated workers with full back benefits within 30 days.

The ratio of this judgment shall apply to all cases where terminations coincide with protected collective bargaining activities.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Province of Punjab vs M/s Sapphire Textile Mills Ltd.',
    citation: 'C.A. No. 891/2020',
    caseNo: 'C.A. No. 891/2020',
    court: 'Supreme Court of Pakistan',
    judge: 'Hon. Mr. Justice Umar Ata Bandial',
    year: 2020,
    keywords: JSON.stringify(['property law', 'land acquisition', 'compensation', 'Land Acquisition Act 1894', 'constitutional']),
    summary: 'Civil appeal concerning the quantum of compensation awarded under the Land Acquisition Act 1894 for land acquired for a public purpose. The Supreme Court examined the methodology for determining market value of acquired land.',
    content: `JUDGMENT

Supreme Court of Pakistan
Civil Appeal No. 891 of 2020

Province of Punjab through
Collector Land Acquisition          ...Appellant
vs
M/s Sapphire Textile Mills Ltd.     ...Respondent

CORAM: Hon. Mr. Justice Umar Ata Bandial

JUDGMENT

This civil appeal arises from the judgment of the Lahore High Court enhancing compensation awarded under the Land Acquisition Act 1894.

QUESTION OF LAW: What is the appropriate methodology for determining fair market value of industrial land acquired for a public project?

LEGAL ANALYSIS:

Section 23 of the Land Acquisition Act 1894 provides that the court shall take into consideration the market value of the land at the date of publication of the Section 4 notification.

The following principles are well-established:

1. The best evidence of market value is recent sales transactions of comparable land in the vicinity.

2. Capitalisation of rent method may be applied where direct comparable sales are unavailable.

3. The owner is entitled to solatium at 15% and additional compensation at 6% per annum for any delay beyond one year.

4. Future potential of the land must be considered where it has development prospects.

Reference: 2019 SCMR 456, PLD 2018 Supreme Court 789.

HELD: The methodology applied by the High Court is correct. Market value as determined at Rs. 4,500 per square yard is upheld. The appeal is dismissed with costs.`,
    fileUrl: null,
  },
  {
    id: uuidv4(),
    title: 'Muhammad Iqbal Chaudhry vs National Accountability Bureau',
    citation: 'Crl. Orig. No. 22/2021',
    caseNo: 'Crl. Orig. No. 22/2021',
    court: 'Supreme Court of Pakistan',
    judge: 'Three Member Bench',
    year: 2021,
    keywords: JSON.stringify(['NAB', 'corruption', 'accountability', 'plea bargain', 'NAO 1999']),
    summary: 'Original jurisdiction petition challenging NAB proceedings and seeking quashment of reference filed under the National Accountability Ordinance 1999. The court examined the threshold requirements for filing a NAB reference.',
    content: `JUDGMENT

Supreme Court of Pakistan
Criminal Original Jurisdiction No. 22 of 2021

Muhammad Iqbal Chaudhry               ...Petitioner
vs
National Accountability Bureau        ...Respondent

CORAM: Three Member Bench

JUDGMENT

The petitioner invokes the original jurisdiction of this court under Article 184(3) of the Constitution of Pakistan, 1973, challenging the NAB reference as being malafide and without lawful authority.

SCOPE OF NAO 1999: Section 9 of the National Accountability Ordinance 1999 defines "corruption and corrupt practices." The prosecution under NAO must establish that the accused held public office or was entrusted with state property.

KEY PRINCIPLES:

1. BURDEN OF PROOF: Under Section 14(c) of NAO, where an accused is found to be in possession of assets disproportionate to known sources of income, the burden shifts to prove that such assets were legitimately acquired.

2. PLEA BARGAIN: Section 25(b) of NAO provides for plea bargain. Once approved by the Chairman NAB, it becomes binding and cannot be challenged collaterally.

3. STANDARD FOR QUASHMENT: A reference can only be quashed where there is a fundamental illegality, complete absence of jurisdiction, or where the proceedings constitute an abuse of process.

HELD: The petitioner has failed to establish any ground warranting quashment. The reference contains sufficient material to proceed to trial. This court is not required to conduct a mini-trial at this stage. The petition is dismissed.`,
    fileUrl: null,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = PRECEDENTS.map(p => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert('precedents', rows, {});
    console.log(`✅ Seeded ${rows.length} demo precedents.`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('precedents', null, {});
  },
};