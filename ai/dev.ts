import { config } from 'dotenv';
config();

import './flows/generate-gig-tags.ts';
import './flows/generate-gig-image.ts';
import './flows/support-chat-flow.ts';
import './flows/generate-gig-description.ts';
import './flows/recommend-gigs.ts';
import './flows/translate-text.ts'; 