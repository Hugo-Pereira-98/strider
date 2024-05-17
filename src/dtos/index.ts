export type IndicationDTO = {
  id: number;
  uid: string;
  institutionId: number;
  institutionMemberId: String;
  assetPartnerId: number;
  companyId: number;
  direction: 'BUY' | 'SELL';
  minSharePrice: number;
  maxSharePrice: number;
  targetSharePrice: number;
  minValuation: number;
  targetValuation: number;
  maxValuation: number;
  minSizeShareCount: number;
  targetSizeShareCount: number;
  maxSizeShareCount: number;
  minSizeNotional: number;
  targetSizeNotional: number;
  maxSizeNotional: number;
  filledSizeShareCount: number;
  filledSizeNotional: number;
  maxSPVLayers: number;
  spvMaxManagement: number;
  spvMaxCarry: number;
  forwardContract: boolean;
  directTransfer: boolean;
  shareClassType: string;
  isExclusive: boolean;
  state: string;
  organizationName?: string;
  symbolLight?: string;
  symbolDark?: string;
  icon?: string;
};

export interface ICompanyDTO {
  id: number;
  organizationId?: number;
  subtitle?: string;
  fundingStage?: string;
  employeeCount?: number;
  shortDescription?: string;
  fullDescription?: string;
  postMoneyValuation?: string;
  totalFunding?: string;
  secondaryActivity?: number;
  isListed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  organization?: IOrganizationDTO;
  shareClasses?: IShareClassDTO[];
  investments?: IInvestmentDTO[];
  _formattedPostMoneyValuation?: string;
  fundingRounds?: IFundingRoundDTO[];
}

export interface IShareClassDTO {
  id?: number;
  companyId?: number;
  issuedFundingRoundId?: number;
  name?: string;
  issuedPrice?: string;
  authorizedQuantity?: string;
  issuedQuantity?: string;
  issuedDate?: Date;
  issuedCurrency?: string;
  isPreferredEquity?: boolean;
  impliedPostMoneyValuation?: string;
  parValue?: string;
  dividendRate?: number;
  liquidationPrice?: string;
  liquidationMultiple?: number;
  conversionPrice?: string;
  isParticipating?: boolean;
  participationCap?: number;
}

export interface IInvestmentDTO {
  id: number;
  investorId: number;
  companyId: number;
  fundId?: number;
  fundingRoundId?: number;
  investmentAmount: bigint;
  investmentCurrency: string;
  isLeadInvestor: boolean;
  createdAt: string;
  updatedAt: string;
  investor?: IInvestorDTO;
  Company?: ICompanyDTO;
  FundingRound?: IFundingRoundDTO;
}

export interface IInvestorDTO {
  id: number;
  personId?: number;
  organizationId: number;
  isTypeAngel: boolean;
  isTypeFundOfFunds: boolean;
  isTypeVentureCapital: boolean;
  isStageEarly: boolean;
  isStageLate: boolean;
  isAccelerator: boolean;
  shortDescription?: string;
  fullDescription?: string;
  isNotable: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: IOrganizationDTO;
  person?: IPersonDTO;
  investments: IInvestmentDTO[];
}

export interface IPersonDTO {
  id: number;
  firstName: string;
  lastName: string;
  primaryOrganization?: IOrganizationDTO;
  shortDescription?: string;
  fullDescription?: string;
  createdAt: string;
  updatedAt: string;
  investor?: IInvestorDTO;
}

export interface IFundingRoundDTO {
  id: number;
  companyId: number;
  type: string;
  moneyRaised?: string;
  currency?: string;
  announcedOn?: Date | string | any;
  closedOn?: Date | string | any;
  investmentStage?: string;
  isEquity?: boolean;
  postMoneyValuation?: string;
  preMoneyValuation?: string;
}

export interface IInstitutionMemberDTO {
  id: string;
  institutionId: number;
  firstName: string;
  lastName: string;
  institution: {
    name: string;
  };
}

export interface INewsArticleDTO {
  articleLink: string;
  articleTitle: string;
  articlePubDate: Date;
  publisher: {
    name: string;
    icon?: string;
    logo?: string;
  };
}

export interface IOrganizationDTO {
  name: string;
  parentOrganization?: number;
  slug: string;
  type: string;
  foundedOn?: any;
  ipoStatus?: string;
  legalName?: string;
  alsoKnownAs?: string;
  shortDescription?: string;
  fullDescription?: string;
  isDefaultCompany: boolean;
  webLinks?: IWebLinkDTO[];
  organizationBranding?: IOrganizationBrandingDTO;
  company: ICompanyDTO;
  newsArticles?: INewsArticleDTO[];
}
export enum WebLinkType {
  WEBSITE = 'website',
  SM_FACEBOOK = 'sm_facebook',
  SM_X = 'sm_x',
  SM_TIKTOK = 'sm_tiktok',
  SM_LINKEDIN = 'sm_linkedin',
  SM_YOUTUBE = 'sm_youtube',
  SM_NOSTR = 'sm_nostr',
  CRUNCHBASE = 'crunchbase',
  ANGELLIST = 'angellist',
  GOOGLE_NEWS_TOPIC_RSS = 'google_news_topic_rss',
  WIKIPEDIA = 'wikipedia',
  COMPANY_BLOG = 'company_blog',
  COMPANY_BLOG_RSS = 'company_blog_rss',
}

export interface IWebLinkDTO {
  id: number;
  organizationId: number;
  type: WebLinkType;
  link: string;
  isPrimaryLink: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IOrganizationBrandingDTO {
  id?: number;
  organizationId?: number;
  icon?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
  symbol?: string;
  symbolLight?: string;
  symbolDark?: string;
  logoLightSvg?: string;
  logoDarkSvg?: string;
  symbolLightSvg?: string;
  symbolDarkSvg?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Answer = {
  answer_id: string;
  answer_text: string;
  answer_score: string;
};

export type Question = {
  question_id: string;
  question_text: string;
  question_weight: number;
  user_answer: string;
  question_score: number;
  answers: Answer[];
};

export type ISuitabilityQuestions = {
  questionnaire_version: number;
  questionnaire_type: 'individual';
  questionnaire: Question[];
};
