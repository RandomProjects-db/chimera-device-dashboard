export interface Device {
  id: number;
  mac: string;
  hostname: string;
  vendor: string;
  given_name: string;
  ip: string;
  user_agent: string[];
  is_active: boolean;
  has_custom_blocklist: boolean;
  group: {
    id: number;
    name: string;
    is_default: boolean;
  };
  first_seen: string;
  last_seen: string;
  is_mac_universal: boolean;
  os_name: string;
  os_accuracy: number;
  os_type: string;
  os_vendor: string;
  os_family: string;
  os_gen: string;
  os_cpe: string[];
  os_last_updated: string;
  blocklist: {
    ads_trackers: boolean;
    gambling: boolean;
    social_media: boolean;
    porn: boolean;
    gaming: boolean;
    streaming: boolean;
    facebook: boolean;
    instagram: boolean;
    tiktok: boolean;
    netflix: boolean;
    youtube: boolean;
    ai: boolean;
    safesearch: boolean;
  };
  ai_classification: {
    device_type: string;
    device_category: string;
    confidence: number;
    reasoning: string;
    indicators: string[];
    last_classified: string;
  };
}
