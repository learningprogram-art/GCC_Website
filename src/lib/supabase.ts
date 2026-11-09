import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://xwycefpvksmpxeavskjj.supabase.co'
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_ZvnG0bQkNbcr9ff1XDFB2A_JGq7nnY-'

const isConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes('your-project-ref') &&
  Boolean(supabasePublishableKey)

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export interface LeadSubmission {
  fullName: string
  phone: string
  locationPin?: string
  projectType?: string
  message?: string
  source?: 'contact_section' | 'hero_desktop' | 'hero_mobile'
}

export interface SubmitResponse {
  success: boolean
  error?: string
}

/**
 * Inserts a new lead into the Supabase database.
 * Default table name is 'leads'.
 */
export async function submitLead(
  payload: LeadSubmission,
  tableName = 'leads'
): Promise<SubmitResponse> {
  if (!supabase) {
    const errorMsg =
      'Supabase Project URL is not configured. Please add your VITE_SUPABASE_URL to the .env file.'
    console.error(`[Supabase] ${errorMsg}`)
    return {
      success: false,
      error: errorMsg,
    }
  }

  try {
    const { error } = await supabase.from(tableName).insert([
      {
        full_name: payload.fullName.trim(),
        phone: payload.phone.trim(),
        location_pin: payload.locationPin?.trim() || null,
        project_type: payload.projectType?.trim() || null,
        message: payload.message?.trim() || null,
        source: payload.source || 'contact_section',
      },
    ])

    if (error) {
      console.error('[Supabase] Submission error:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unexpected error occurred'
    console.error('[Supabase] Unexpected error:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

