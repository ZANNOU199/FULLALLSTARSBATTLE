<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\FeaturedPiece;
use App\Models\Participant;
use App\Models\Organizer;
use App\Models\Article;
use App\Models\ProgramDay;
use App\Models\Activity;
use App\Models\Ticket;
use App\Models\FAQ;
use App\Models\BracketMatch;
use App\Models\TimelineEvent;
use App\Models\Legend;
use App\Models\Partner;
use App\Models\MediaItem;
use App\Models\GlobalConfig;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessageReplyMail;
use App\Models\PageBackground;
use App\Models\Competition;
use App\Models\ContactMessage;

class CMSController extends Controller
{
    /**
     * Get all CMS data (REST endpoint matching cmsService.getData() from frontend)
     * Returns complete CMSData structure - frontend makes ONE request to get everything
     */
    public function getData()
    {
        try {
            $cmsData = [
                'companies' => $this->getCompanies(),
                'featuredPiece' => $this->getFeaturedPiece(),
                'participants' => $this->getParticipants(),
                'program' => $this->getProgram(),
                'categories' => $this->getCategories(),
                'blog' => ['articles' => $this->getArticles()],
                'competition' => $this->getCompetition(),
                'ticketing' => $this->getTicketing(),
                'history' => $this->getHistory(),
                'contact' => $this->getContact(),
                'partners' => $this->getPartners(),
                'media' => $this->getMedia(),
                'globalConfig' => $this->getGlobalConfig(),
                'theme' => $this->getTheme(),
                'pageBackgrounds' => $this->getPageBackgrounds(),
                'siteAssets' => $this->getSiteAssets(),
                'participate' => $this->getParticipate(),
                'organizers' => $this->getOrganizers(),
                'organizersConfig' => $this->getOrganizersConfig(),
            ];

            return response()->json($cmsData, 200);
        } catch (\Exception $e) {
            \Log::error('getData failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to load CMS data',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }

    private function getCompanies()
    {
        return Company::all()->map(fn($c) => [
            'id' => (string)$c->id,
            'name' => $c->name,
            'choreographer' => $c->choreographer,
            'pieceTitle' => $c->piece_title,
            'description' => $c->description,
            'bio' => $c->bio,
            'mainImage' => $c->main_image,
            'gallery' => json_decode($c->gallery, true) ?? [],
            'performanceDate' => $c->performance_date,
            'performanceTime' => $c->performance_time,
        ])->toArray();
    }

    private function getFeaturedPiece()
    {
        $piece = FeaturedPiece::first();
        return $piece ? [
            'id' => (string)$piece->id,
            'title' => $piece->title,
            'image' => $piece->image,
            'duration' => $piece->duration,
            'choreographer' => $piece->choreographer,
            'music' => $piece->music,
            'description' => $piece->description,
            'fullSynopsis' => $piece->full_synopsis,
            'intentionQuote' => $piece->intention_quote,
            'intentionAuthor' => $piece->intention_author,
            'performers' => $piece->performers,
            'technology' => $piece->technology,
        ] : null;
    }

    private function getParticipants()
    {
        return Participant::all()->map(fn($p) => [
            'id' => (string)$p->id,
            'name' => $p->name,
            'country' => $p->country,
            'countryCode' => $p->country_code,
            'specialty' => $p->specialty,
            'bio' => $p->bio,
            'photo' => $p->photo,
            'socialLinks' => json_decode($p->social_links, true) ?? [],
            'category' => $p->category,
        ])->toArray();
    }

    private function getProgram()
    {
        return ProgramDay::with('activities')->get()->map(fn($day) => [
            'id' => (string)$day->id,
            'date' => $day->date,
            'label' => $day->label,
            'activities' => $day->activities->map(fn($a) => [
                'id' => (string)$a->id,
                'time' => $a->time,
                'title' => $a->title,
                'location' => $a->location,
                'description' => $a->description,
                'category' => $a->category,
            ])->toArray(),
        ])->toArray();
    }

    private function getArticles()
    {
        return Article::all()->map(fn($a) => [
            'id' => (string)$a->id,
            'title' => $a->title,
            'content' => $a->content,
            'category' => $a->category,
            'coverImage' => $a->cover_image,
            'date' => $a->date,
            'tag' => $a->tag,
        ])->toArray();
    }

    private function getCompetition()
    {
        $competition = Competition::first();

        if (!$competition) {
            return [
                'rules' => 'Le jugement est basé sur la technique, l\'originalité et la musicalité.',
                'prizePool' => [],
                'brackets' => [
                    'pouleA' => [
                        'huitiemes' => [],
                        'quarts' => [],
                        'semis' => [],
                    ],
                    'pouleB' => [
                        'huitiemes' => [],
                        'quarts' => [],
                        'semis' => [],
                    ],
                    'final' => [],
                ],
            ];
        }

        return [
            'rules' => $competition->rules ?: 'Le jugement est basé sur la technique, l\'originalité et la musicalité.',
            'prizePool' => json_decode($competition->prize_pool, true) ?: [],
            'brackets' => json_decode($competition->brackets ?? 'null', true) ?: [
                'pouleA' => [
                    'huitiemes' => [],
                    'quarts' => [],
                    'semis' => [],
                ],
                'pouleB' => [
                    'huitiemes' => [],
                    'quarts' => [],
                    'semis' => [],
                ],
                'final' => [],
            ],
        ];
    }

    public function saveData(\Illuminate\Http\Request $request)
    {
        // Debug: Check raw input
        \Log::info('=== SAVE DATA REQUEST DEBUG ===');
        \Log::info('Request method:', ['method' => $request->method()]);
        \Log::info('Request content type:', ['type' => $request->header('Content-Type')]);
        
        // Get raw body and ensure it's UTF-8
        $rawBody = $request->getContent();
        $rawBody = mb_convert_encoding($rawBody, 'UTF-8', 'UTF-8');
        \Log::info('Raw body size:', ['size' => strlen($rawBody)]);
        \Log::info('Raw body first 300 chars:', ['body' => substr($rawBody, 0, 300)]);
        
        // Try to decode it with UTF-8 support
        $decodedPayload = json_decode($rawBody, true);
        \Log::info('After json_decode:', ['is_null' => is_null($decodedPayload), 'is_array' => is_array($decodedPayload), 'count' => count($decodedPayload ?? []), 'json_error' => json_last_error_msg()]);
        if (is_array($decodedPayload)) {
            \Log::info('Decoded payload keys:', ['keys' => array_keys($decodedPayload)]);
        }
        
        // If json decode failed, try using Laravel's built-in method
        if (is_null($decodedPayload)) {
            $decodedPayload = $request->json()->all();
            \Log::info('Used Laravel json() method:', ['is_array' => is_array($decodedPayload), 'count' => count($decodedPayload ?? [])]);
        }
        
        $payload = $decodedPayload ?? [];

        try {
            // Ensure tier column exists
            $this->ensurePartnersTierColumn();

            // Save companies data
            $companiesData = $payload['companies'] ?? [];
            \Log::info('=== SAVE DATA ===');
            \Log::info('Payload keys:', ['keys' => array_keys($payload)]);
            \Log::info('Companies data type:', ['type' => gettype($companiesData)]);
            \Log::info('Companies count:', ['count' => count($companiesData)]);
            
            $incomingIds = [];
            $newlyCreatedIds = [];
            
            if (is_array($companiesData) && count($companiesData) > 0) {
                \Log::info('Processing ' . count($companiesData) . ' companies');
                
                foreach ($companiesData as $index => $companyPayload) {
                    \Log::info("Company $index:", ['id' => $companyPayload['id'] ?? 'NO_ID']);
                    
                    if (!empty($companyPayload['id'])) {
                        // EXISTING COMPANY - Update by ID
                        $companyId = is_numeric($companyPayload['id']) ? (int)$companyPayload['id'] : $companyPayload['id'];
                        $incomingIds[] = $companyId;
                        
                        Company::updateOrCreate(
                            ['id' => $companyId],
                            [
                                'name' => $companyPayload['name'] ?? '',
                                'choreographer' => $companyPayload['choreographer'] ?? '',
                                'piece_title' => $companyPayload['pieceTitle'] ?? '',
                                'description' => $companyPayload['description'] ?? '',
                                'bio' => $companyPayload['bio'] ?? '',
                                'main_image' => $companyPayload['mainImage'] ?? '',
                                'gallery' => json_encode($companyPayload['gallery'] ?? []),
                                'performance_date' => $companyPayload['performanceDate'] ?? null,
                                'performance_time' => $companyPayload['performanceTime'] ?? null,
                            ]
                        );
                        \Log::info("Updated company $companyId");
                    } else {
                        // NEW COMPANY - Create without specifying ID (let auto-increment work)
                        \Log::info('Creating new company: ' . ($companyPayload['name'] ?? 'NO_NAME'));
                        $company = Company::create([
                            'name' => $companyPayload['name'] ?? '',
                            'choreographer' => $companyPayload['choreographer'] ?? '',
                            'piece_title' => $companyPayload['pieceTitle'] ?? '',
                            'description' => $companyPayload['description'] ?? '',
                            'bio' => $companyPayload['bio'] ?? '',
                            'main_image' => $companyPayload['mainImage'] ?? '',
                            'gallery' => json_encode($companyPayload['gallery'] ?? []),
                            'performance_date' => $companyPayload['performanceDate'] ?? null,
                            'performance_time' => $companyPayload['performanceTime'] ?? null,
                        ]);
                        $newlyCreatedIds[] = $company->id;
                        \Log::info('New company created with ID: ' . $company->id);
                    }
                }
                
                // DELETE SUPPORT: Delete companies NOT in (incoming IDs + newly created IDs)
                // But only if we had some companies with IDs (meaning this is a delete request + updates, not just new additions)
                if (!empty($incomingIds)) {
                    $allValidIds = array_merge($incomingIds, $newlyCreatedIds);
                    \Log::info('Incoming IDs:', ['ids' => $incomingIds]);
                    \Log::info('Newly created IDs:', ['ids' => $newlyCreatedIds]);
                    \Log::info('All valid IDs:', ['ids' => $allValidIds]);
                    
                    // Get companies to delete and remove their images from R2 first
                    $companiesToDelete = Company::whereNotIn('id', $allValidIds)->get();
                    foreach ($companiesToDelete as $company) {
                        if ($company->main_image) {
                            UploadController::deleteFromR2($company->main_image);
                        }
                        // Also delete gallery images
                        $gallery = json_decode($company->gallery, true) ?? [];
                        if (is_array($gallery)) {
                            foreach ($gallery as $galleryImage) {
                                if (is_array($galleryImage) && isset($galleryImage['url'])) {
                                    UploadController::deleteFromR2($galleryImage['url']);
                                }
                            }
                        }
                    }
                    
                    $deletedCount = Company::whereNotIn('id', $allValidIds)->delete();
                    \Log::info('Deleted companies count:', ['count' => $deletedCount]);
                }
            } else {
                \Log::info('No companies to process');
            }

            // Save featured piece data
            $featuredPieceData = $payload['featuredPiece'] ?? [];
            if (!empty($featuredPieceData)) {
                \Log::info('Saving featured piece data');
                
                FeaturedPiece::updateOrCreate(
                    ['id' => 1], // Always use ID 1 for the single featured piece
                    [
                        'title' => $featuredPieceData['title'] ?? '',
                        'image' => $featuredPieceData['image'] ?? '',
                        'duration' => $featuredPieceData['duration'] ?? '',
                        'choreographer' => $featuredPieceData['choreographer'] ?? '',
                        'music' => $featuredPieceData['music'] ?? '',
                        'description' => $featuredPieceData['description'] ?? '',
                        'full_synopsis' => $featuredPieceData['fullSynopsis'] ?? '',
                        'intention_quote' => $featuredPieceData['intentionQuote'] ?? '',
                        'intention_author' => $featuredPieceData['intentionAuthor'] ?? '',
                        'performers' => $featuredPieceData['performers'] ?? '',
                        'technology' => $featuredPieceData['technology'] ?? '',
                    ]
                );
                \Log::info('Featured piece saved');
            }

            // Save competition data
            $competitionData = $payload['competition'] ?? [];

            $competition = Competition::first();
            if (!$competition) {
                $competition = Competition::create([
                    'name' => 'All Stars Battle',
                    'rules' => $competitionData['rules'] ?? '',
                    'prize_pool' => json_encode($competitionData['prizePool'] ?? []),
                    'brackets' => json_encode($competitionData['brackets'] ?? []),
                ]);
            } else {
                $competition->update([
                    'rules' => $competitionData['rules'] ?? $competition->rules,
                    'prize_pool' => json_encode($competitionData['prizePool'] ?? json_decode($competition->prize_pool, true) ?? []),
                    'brackets' => json_encode($competitionData['brackets'] ?? json_decode($competition->brackets ?? '[]', true) ?? []),
                ]);
            }

            // Save partners data
            $partnersData = $payload['partners'] ?? [];
            if (isset($partnersData['logos'])) {
                $incomingIds = collect($partnersData['logos'])->pluck('id')->filter()->toArray();

                // Delete partners that are not in the incoming data
                Partner::whereNotIn('id', $incomingIds)->delete();

                // Update or create partners from payload
                foreach ($partnersData['logos'] as $partnerPayload) {
                    if (isset($partnerPayload['id'])) {
                        Partner::updateOrCreate(
                            ['id' => $partnerPayload['id']],
                            [
                                'name' => $partnerPayload['name'] ?? '',
                                'logo' => $partnerPayload['logo'] ?? '',
                                'category' => $partnerPayload['category'] ?? 'Main',
                                'tier' => $partnerPayload['tier'] ?? 'Partenaire Officiel',
                                'website' => $partnerPayload['website'] ?? '',
                            ]
                        );
                    }
                }
            }

            // Save organizers data and configuration
            $organizersData = $payload['organizers'] ?? [];
            if (is_array($organizersData)) {
                $incomingIds = [];

                foreach ($organizersData as $organizerPayload) {
                    if (!empty($organizerPayload['id'])) {
                        $organizerId = is_numeric($organizerPayload['id']) ? (int)$organizerPayload['id'] : $organizerPayload['id'];
                        $incomingIds[] = $organizerId;

                        Organizer::updateOrCreate(
                            ['id' => $organizerId],
                            [
                                'name' => $organizerPayload['name'] ?? '',
                                'role' => $organizerPayload['role'] ?? '',
                                'bio' => $organizerPayload['bio'] ?? '',
                                'photo' => $organizerPayload['photo'] ?? '',
                                'social_links' => json_encode($organizerPayload['socialLinks'] ?? []),
                            ]
                        );
                    } else {
                        $newOrganizer = Organizer::create([
                            'name' => $organizerPayload['name'] ?? '',
                            'role' => $organizerPayload['role'] ?? '',
                            'bio' => $organizerPayload['bio'] ?? '',
                            'photo' => $organizerPayload['photo'] ?? '',
                            'social_links' => json_encode($organizerPayload['socialLinks'] ?? []),
                        ]);
                        $incomingIds[] = $newOrganizer->id;
                    }
                }

                if (!empty($incomingIds)) {
                    Organizer::whereNotIn('id', $incomingIds)->delete();
                }
            }

            $organizersConfig = $payload['organizersConfig'] ?? [];
            if (is_array($organizersConfig)) {
                GlobalConfig::updateOrCreate(
                    ['key' => 'organizers.sectionTitle'],
                    ['value' => json_encode($organizersConfig['sectionTitle'] ?? '')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'organizers.sectionDescription'],
                    ['value' => json_encode($organizersConfig['sectionDescription'] ?? '')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'organizers.organizationName'],
                    ['value' => json_encode($organizersConfig['organizationName'] ?? '')]
                );
            }

            $contactData = $payload['contact'] ?? [];
            if (is_array($contactData)) {
                $contactHero = $contactData['hero'] ?? [];
                $contactSections = $contactData['sections'] ?? [];

                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.hero.title'],
                    ['value' => json_encode($contactHero['title'] ?? 'Besoin ')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.hero.titleHighlight'],
                    ['value' => json_encode($contactHero['titleHighlight'] ?? 'd\'aide ?')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.hero.description'],
                    ['value' => json_encode($contactHero['description'] ?? 'L\'équipe All Stars Battle International est là pour vous accompagner.')]
                );

                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.coordinatesTitle'],
                    ['value' => json_encode($contactSections['coordinatesTitle'] ?? 'Coordonnées')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.hoursLabel'],
                    ['value' => json_encode($contactSections['hoursLabel'] ?? 'Horaires')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.hoursValue'],
                    ['value' => json_encode($contactSections['hoursValue'] ?? 'Lun-Ven, 09h00 - 18h00')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.responseTime'],
                    ['value' => json_encode($contactSections['responseTime'] ?? 'Réponse sous 24h')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.socialLabel'],
                    ['value' => json_encode($contactSections['socialLabel'] ?? 'Suivez le mouvement')]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'contact.sections.faqTitle'],
                    ['value' => json_encode($contactSections['faqTitle'] ?? 'Foire Aux Questions')]
                );
            }

            $globalConfigData = $payload['globalConfig'] ?? [];
            if (is_array($globalConfigData)) {
                $gc = $globalConfigData;
                
                \Log::info('=== GLOBALCONFIG SAVE DEBUG ===');
                \Log::info('GC keys:', ['keys' => array_keys($gc)]);
                \Log::info('Stats data:', ['stats' => $gc['stats'] ?? 'NOT_FOUND', 'homepageStats' => $gc['homepageStats'] ?? 'NOT_FOUND']);
                
                // contact data
                GlobalConfig::updateOrCreate(['key' => 'contact.email'], ['value' => json_encode($gc['contact']['email'] ?? 'contact@asbi.com')]);
                GlobalConfig::updateOrCreate(['key' => 'contact.phone'], ['value' => json_encode($gc['contact']['phone'] ?? '+228 90 00 00 00')]);
                GlobalConfig::updateOrCreate(['key' => 'contact.address'], ['value' => json_encode($gc['contact']['address'] ?? 'Lomé, Togo')]);

                // socials
                GlobalConfig::updateOrCreate(['key' => 'socials.instagram'], ['value' => json_encode($gc['socials']['instagram'] ?? '#')]);
                GlobalConfig::updateOrCreate(['key' => 'socials.facebook'], ['value' => json_encode($gc['socials']['facebook'] ?? '#')]);
                GlobalConfig::updateOrCreate(['key' => 'socials.twitter'], ['value' => json_encode($gc['socials']['twitter'] ?? '#')]);
                GlobalConfig::updateOrCreate(['key' => 'socials.youtube'], ['value' => json_encode($gc['socials']['youtube'] ?? '#')]);

                // seo
                GlobalConfig::updateOrCreate(['key' => 'seo.title'], ['value' => json_encode($gc['seo']['title'] ?? 'All Stars Battle International 2026')]);
                GlobalConfig::updateOrCreate(['key' => 'seo.description'], ['value' => json_encode($gc['seo']['description'] ?? 'La plus grande compétition de danse urbaine en Afrique.')]);
                GlobalConfig::updateOrCreate(['key' => 'seo.keywords'], ['value' => json_encode($gc['seo']['keywords'] ?? 'danse, battle, hip-hop, breaking, togo, lomé')]);

                // hero
                GlobalConfig::updateOrCreate(['key' => 'hero.title'], ['value' => json_encode($gc['hero']['title'] ?? 'ALL STARS BATTLE INTERNATIONAL')]);
                GlobalConfig::updateOrCreate(['key' => 'hero.subtitle'], ['value' => json_encode($gc['hero']['subtitle'] ?? 'Le Trône. Le Respect. La Légende.')]);
                GlobalConfig::updateOrCreate(['key' => 'hero.location'], ['value' => json_encode($gc['hero']['location'] ?? 'TOGO 2026')]);
                GlobalConfig::updateOrCreate(['key' => 'hero.backgroundImage'], ['value' => json_encode($gc['hero']['backgroundImage'] ?? 'https://images.unsplash.com/photo-1547153760-18fc86324498')]);
                GlobalConfig::updateOrCreate(['key' => 'hero.videoUrl'], ['value' => json_encode($gc['hero']['videoUrl'] ?? 'https://vjs.zencdn.net/v/oceans.mp4')]);

                // competition
                GlobalConfig::updateOrCreate(['key' => 'competition.dateStart'], ['value' => json_encode($gc['competition']['dateStart'] ?? '14 - 16 AOÛT 2026')]);
                GlobalConfig::updateOrCreate(['key' => 'competition.location'], ['value' => json_encode($gc['competition']['location'] ?? 'PALAIS DES CONGRÈS DE LOMÉ, TOGO')]);
                GlobalConfig::updateOrCreate(['key' => 'competition.description'], ['value' => json_encode($gc['competition']['description'] ?? 'L\'élite mondiale du breaking et du hip-hop...')]);

                // eventDate
                GlobalConfig::updateOrCreate(['key' => 'eventDate'], ['value' => json_encode($gc['eventDate'] ?? '2026-08-14')]);

                // homepage stats - support both 'stats' and 'homepageStats' keys from frontend
                $statsData = $gc['stats'] ?? $gc['homepageStats'] ?? [];
                \Log::info('Saving stats:', ['statsData' => $statsData, 'count' => count($statsData)]);
                GlobalConfig::updateOrCreate(['key' => 'stats'], ['value' => json_encode($statsData)]);
                \Log::info('Stats saved to DB');

                // homepage sections (dancers, programmation, vip, partners, blog, footer)
                GlobalConfig::updateOrCreate(['key' => 'dancers.sectionTitle'], ['value' => json_encode($gc['dancers']['sectionTitle'] ?? 'LES DANSEURS')]);
                GlobalConfig::updateOrCreate(['key' => 'dancers.sectionSubtitle'], ['value' => json_encode($gc['dancers']['sectionSubtitle'] ?? 'Featured')]);
                GlobalConfig::updateOrCreate(['key' => 'programmation.sectionTitle'], ['value' => json_encode($gc['programmation']['sectionTitle'] ?? 'PROGRAMMATION')]);
                GlobalConfig::updateOrCreate(['key' => 'vip.sectionTitle'], ['value' => json_encode($gc['vip']['sectionTitle'] ?? 'EXPÉRIENCE VIP')]);
                GlobalConfig::updateOrCreate(['key' => 'vip.sectionDescription'], ['value' => json_encode($gc['vip']['sectionDescription'] ?? 'Plongez au cœur de l\'action avec un accès privilégié.')]);
                GlobalConfig::updateOrCreate(['key' => 'vip.features'], ['value' => json_encode($gc['vip']['features'] ?? [])]);
                GlobalConfig::updateOrCreate(['key' => 'partners.sectionTitle'], ['value' => json_encode($gc['partners']['sectionTitle'] ?? 'PARTENAIRES & SPONSORS')]);
                GlobalConfig::updateOrCreate(['key' => 'blog.sectionTitle'], ['value' => json_encode($gc['blog']['sectionTitle'] ?? 'ACTUALITÉS & NEWS')]);
                GlobalConfig::updateOrCreate(['key' => 'footer.description'], ['value' => json_encode($gc['footer']['description'] ?? 'All Stars Battle International')]);
                GlobalConfig::updateOrCreate(['key' => 'footer.copyright'], ['value' => json_encode($gc['footer']['copyright'] ?? '© 2026 ASBI. Tous droits réservés.')]);

                // Theme colors (Legacy support from globalConfig.theme)
                if (isset($gc['theme']) && is_array($gc['theme'])) {
                    GlobalConfig::updateOrCreate([
                        'key' => 'theme'
                    ], [
                        'value' => json_encode([
                            'primary' => $gc['theme']['primary'] ?? '#d35f17',
                            'accent' => $gc['theme']['accent'] ?? '#f4d125',
                            'accentRed' => $gc['theme']['accentRed'] ?? '#dc2626',
                            'background' => $gc['theme']['background'] ?? '#0a0807',
                            'surface' => $gc['theme']['surface'] ?? '#1a1a1a',
                            'text' => $gc['theme']['text'] ?? '#ffffff',
                            'mutedText' => $gc['theme']['mutedText'] ?? '#94a3b8',
                        ])
                    ]);
                }
            }

            // Theme colors (top-level payload)
            $themePayload = $payload['theme'] ?? [];
            if (is_array($themePayload) && !empty($themePayload)) {
                GlobalConfig::updateOrCreate([
                    'key' => 'theme'
                ], [
                    'value' => json_encode([
                        'primary' => $themePayload['primary'] ?? '#d35f17',
                        'accent' => $themePayload['accent'] ?? '#f4d125',
                        'accentRed' => $themePayload['accentRed'] ?? '#dc2626',
                        'background' => $themePayload['background'] ?? '#0a0807',
                        'surface' => $themePayload['surface'] ?? '#1a1a1a',
                        'text' => $themePayload['text'] ?? '#ffffff',
                        'mutedText' => $themePayload['mutedText'] ?? '#94a3b8',
                    ])
                ]);
            }

            // Page backgrounds
            $pageBackgroundsPayload = $payload['pageBackgrounds'] ?? [];
            if (is_array($pageBackgroundsPayload) && !empty($pageBackgroundsPayload)) {
                GlobalConfig::updateOrCreate([
                    'key' => 'pageBackgrounds'
                ], [
                    'value' => json_encode($pageBackgroundsPayload)
                ]);
            }

            // Save history section data, y compris timeline et legends
            if (isset($payload['history'])) {
                $history = $payload['history'];

                // Save hero/stats/wallOfFame config in global_config
                GlobalConfig::updateOrCreate(
                    ['key' => 'history.hero'],
                    ['value' => json_encode($history['hero'] ?? [])]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'history.stats'],
                    ['value' => json_encode($history['stats'] ?? [])]
                );
                GlobalConfig::updateOrCreate(
                    ['key' => 'history.wallOfFame'],
                    ['value' => json_encode($history['wallOfFame'] ?? [])]
                );

                // Timeline
                if (isset($history['timeline']) && is_array($history['timeline'])) {
                    $incomingIds = [];
                    foreach ($history['timeline'] as $eventPayload) {
                        if (!empty($eventPayload['id'])) {
                            $timelineEvent = TimelineEvent::updateOrCreate(
                                ['id' => $eventPayload['id']],
                                [
                                    'year' => $eventPayload['year'] ?? null,
                                    'title' => $eventPayload['title'] ?? '',
                                    'champion' => $eventPayload['champion'] ?? '',
                                    'description' => $eventPayload['description'] ?? '',
                                    'image' => $eventPayload['image'] ?? '',
                                ]
                            );
                        } else {
                            $timelineEvent = TimelineEvent::create([
                                'year' => $eventPayload['year'] ?? null,
                                'title' => $eventPayload['title'] ?? '',
                                'champion' => $eventPayload['champion'] ?? '',
                                'description' => $eventPayload['description'] ?? '',
                                'image' => $eventPayload['image'] ?? '',
                            ]);
                        }
                        $incomingIds[] = $timelineEvent->id;
                    }
                    if (!empty($incomingIds)) {
                        TimelineEvent::whereNotIn('id', $incomingIds)->delete();
                    }
                }

                // Legends
                if (isset($history['legends']) && is_array($history['legends'])) {
                    $incomingLegendIds = [];
                    foreach ($history['legends'] as $legendPayload) {
                        if (!empty($legendPayload['id'])) {
                            $legend = Legend::updateOrCreate(
                                ['id' => $legendPayload['id']],
                                [
                                    'name' => $legendPayload['name'] ?? '',
                                    'bio' => $legendPayload['bio'] ?? '',
                                    'photo' => $legendPayload['photo'] ?? '',
                                    'title' => $legendPayload['title'] ?? '',
                                    'category' => $legendPayload['category'] ?? 'bboy',
                                    'year' => $legendPayload['year'] ?? null,
                                    'type' => $legendPayload['type'] ?? null,
                                ]
                            );
                        } else {
                            $legend = Legend::create([
                                'name' => $legendPayload['name'] ?? '',
                                'bio' => $legendPayload['bio'] ?? '',
                                'photo' => $legendPayload['photo'] ?? '',
                                'title' => $legendPayload['title'] ?? '',
                                'category' => $legendPayload['category'] ?? 'bboy',
                                'year' => $legendPayload['year'] ?? null,
                                'type' => $legendPayload['type'] ?? null,
                            ]);
                        }
                        $incomingLegendIds[] = $legend->id;
                    }
                    if (!empty($incomingLegendIds)) {
                        Legend::whereNotIn('id', $incomingLegendIds)->delete();
                    }
                }
            }

            // Save participate page data
            $participatePayload = $payload['participate'] ?? [];
            if (is_array($participatePayload) && !empty($participatePayload)) {
                GlobalConfig::updateOrCreate([
                    'key' => 'participate'
                ], [
                    'value' => json_encode($participatePayload)
                ]);
            }

            // Save media items
            // Save site assets (logo, etc.)
            $siteAssetsPayload = $payload['siteAssets'] ?? [];
            if (is_array($siteAssetsPayload)) {
                if (isset($siteAssetsPayload['logo']) && is_array($siteAssetsPayload['logo'])) {
                    GlobalConfig::updateOrCreate(
                        ['key' => 'siteAssets.logo'],
                        ['value' => json_encode($siteAssetsPayload['logo'])]
                    );
                    \Log::info('Saved site logo to database');
                }
            }

            $mediaPayload = $payload['media'] ?? [];
            if (is_array($mediaPayload) && !empty($mediaPayload)) {
                $incomingIds = [];
                foreach ($mediaPayload as $mediaItemPayload) {
                    if (!empty($mediaItemPayload['id'])) {
                        $mediaItem = MediaItem::updateOrCreate(
                            ['id' => $mediaItemPayload['id']],
                            [
                                'title' => $mediaItemPayload['title'] ?? '',
                                'url' => $mediaItemPayload['url'] ?? '',
                                'type' => $mediaItemPayload['type'] ?? 'photo',
                                'duration' => $mediaItemPayload['duration'] ?? null,
                                'thumbnail' => $mediaItemPayload['thumbnail'] ?? null,
                                'tags' => json_encode($mediaItemPayload['tags'] ?? []),
                                'year' => $mediaItemPayload['year'] ?? null,
                                'description' => $mediaItemPayload['description'] ?? null,
                                'tag' => $mediaItemPayload['tag'] ?? null,
                            ]
                        );
                    } else {
                        $mediaItem = MediaItem::create([
                            'title' => $mediaItemPayload['title'] ?? '',
                            'url' => $mediaItemPayload['url'] ?? '',
                            'type' => $mediaItemPayload['type'] ?? 'photo',
                            'duration' => $mediaItemPayload['duration'] ?? null,
                            'thumbnail' => $mediaItemPayload['thumbnail'] ?? null,
                            'tags' => json_encode($mediaItemPayload['tags'] ?? []),
                            'year' => $mediaItemPayload['year'] ?? null,
                            'description' => $mediaItemPayload['description'] ?? null,
                            'tag' => $mediaItemPayload['tag'] ?? null,
                        ]);
                    }
                    $incomingIds[] = $mediaItem->id;
                }
                if (!empty($incomingIds)) {
                    // Get media items to delete and remove their files from R2 first
                    $mediaToDelete = MediaItem::whereNotIn('id', $incomingIds)->get();
                    foreach ($mediaToDelete as $media) {
                        if ($media->url) {
                            UploadController::deleteFromR2($media->url);
                        }
                        if ($media->thumbnail) {
                            UploadController::deleteFromR2($media->thumbnail);
                        }
                    }
                    
                    MediaItem::whereNotIn('id', $incomingIds)->delete();
                }
            }

            return response()->json([
                'message' => 'CMS data saved successfully',
                'companies' => $this->getCompanies(),
                'competition' => $this->getCompetition(),
                'partners' => $this->getPartners(),
                'history' => $this->getHistory(),
                'organizers' => $this->getOrganizers(),
                'organizersConfig' => $this->getOrganizersConfig(),
                'media' => $this->getMedia(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function ensurePartnersTierColumn()
    {
        if (Schema::hasTable('partners') && !Schema::hasColumn('partners', 'tier')) {
            Schema::table('partners', function ($table) {
                $table->string('tier')->nullable()->after('category');
            });
        }
    }

    private function getTicketing()
    {
        return [
            'tickets' => [],
            'faqs' => FAQ::all()->map(fn($f) => [
                'id' => (string)$f->id,
                'question' => $f->question,
                'answer' => $f->answer,
            ])->toArray(),
        ];
    }

    private function getHistory()
    {
        $hero = $this->getConfigItem('history.hero', [
            'sinceYear' => '2013',
            'totalEditions' => '12',
            'title' => 'L\'HISTOIRE',
            'titleHighlight' => 'DE ALLSTARBATTLE',
            'description' => 'Tracing the evolution of urban-luxury breakdance from Genesis to the Global Stage.',
        ]);

        $stats = $this->getConfigItem('history.stats', [
            'years' => '13',
            'editions' => '12',
            'countries' => '45+',
            'participants' => '500+',
            'prize' => '10M',
        ]);

        $wallOfFame = $this->getConfigItem('history.wallOfFame', [
            'title' => 'WALL OF FAME',
            'subtitle' => 'The Legends Who Defined ASBI',
        ]);

        $timeline = TimelineEvent::all()->map(fn($t) => [
            'id' => (string)$t->id,
            'year' => $t->year,
            'title' => $t->title,
            'champion' => $t->champion,
            'description' => $t->description,
            'image' => $t->image,
        ])->toArray();

        // Provide default timeline if empty
        if (empty($timeline)) {
            $timeline = [
                [
                    'id' => '1',
                    'year' => '2024',
                    'title' => 'Genesis',
                    'champion' => 'B-BOY SPIRIT',
                    'description' => 'The beginning of All Stars Battle.',
                    'image' => 'https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev/defaults/timeline-2024.jpg',
                ],
            ];
        }

        $legends = Legend::all()->map(fn($l) => [
            'id' => (string)$l->id,
            'name' => $l->name,
            'bio' => $l->bio,
            'photo' => $l->photo,
            'title' => $l->title,
            'category' => $l->category,
            'year' => $l->year,
            'type' => $l->type,
        ])->toArray();

        // Provide default legends if empty
        if (empty($legends)) {
            $legends = [
                [
                    'id' => '1',
                    'name' => 'B-BOY LEGEND',
                    'bio' => 'A true legend of breakdance.',
                    'photo' => 'https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev/defaults/legend-1.jpg',
                    'title' => 'Champion',
                    'category' => 'bboy',
                    'year' => 2024,
                    'type' => 'bboy',
                ],
            ];
        }

        return [
            'hero' => $hero,
            'stats' => $stats,
            'wallOfFame' => $wallOfFame,
            'timeline' => $timeline,
            'legends' => $legends,
        ];
    }

    private function getConfigItem(string $key, $default = null)
    {
        $record = GlobalConfig::where('key', $key)->first();
        if (!$record || $record->value === null) {
            return $default;
        }

        $decoded = json_decode($record->value, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        return $record->value;
    }

    private function getContact()
    {
        return [
            'hero' => [
                'title' => $this->getConfigItem('contact.hero.title', 'Besoin '),
                'titleHighlight' => $this->getConfigItem('contact.hero.titleHighlight', 'd\'aide ?'),
                'description' => $this->getConfigItem('contact.hero.description', 'L\'équipe All Stars Battle International est là pour vous accompagner.'),
            ],
            'sections' => [
                'coordinatesTitle' => $this->getConfigItem('contact.sections.coordinatesTitle', 'Coordonnées'),
                'hoursLabel' => $this->getConfigItem('contact.sections.hoursLabel', 'Horaires'),
                'hoursValue' => $this->getConfigItem('contact.sections.hoursValue', 'Lun-Ven, 09h00 - 18h00'),
                'responseTime' => $this->getConfigItem('contact.sections.responseTime', 'Réponse sous 24h'),
                'socialLabel' => $this->getConfigItem('contact.sections.socialLabel', 'Suivez le mouvement'),
                'faqTitle' => $this->getConfigItem('contact.sections.faqTitle', 'Foire Aux Questions'),
            ],
        ];
    }

    private function getPartners()
    {
        return [
            'logos' => Partner::all()->map(fn($p) => [
                'id' => (string)$p->id,
                'name' => $p->name,
                'logo' => $p->logo,
                'category' => $p->category,
                'tier' => $p->tier,
            ])->toArray(),
            'sponsoringPdfUrl' => '#',
            'cta' => [
                'title' => 'Devenez Partenaire',
                'subtitle' => 'Rejoignez l\'élite de la culture urbaine africaine',
                'buttonText' => 'Contactez-nous',
            ],
        ];
    }

    private function getMedia()
    {
        return MediaItem::all()->map(fn($m) => [
            'id' => (string)$m->id,
            'title' => $m->title,
            'type' => $m->type,
            'url' => $m->url,
            'thumbnail' => $m->thumbnail,
            'duration' => $m->duration,
            'tags' => json_decode($m->tags, true) ?? [],
            'year' => $m->year,
            'description' => $m->description,
            'tag' => $m->tag,
        ])->toArray();
    }

    private function getGlobalConfig()
    {
        return [
            'contact' => [
                'email' => $this->getConfigItem('contact.email', 'contact@asbi.com'),
                'phone' => $this->getConfigItem('contact.phone', '+228 90 00 00 00'),
                'address' => $this->getConfigItem('contact.address', 'Lomé, Togo'),
            ],
            'socials' => [
                'instagram' => $this->getConfigItem('socials.instagram', '#'),
                'facebook' => $this->getConfigItem('socials.facebook', '#'),
                'twitter' => $this->getConfigItem('socials.twitter', '#'),
                'youtube' => $this->getConfigItem('socials.youtube', '#'),
            ],
            'seo' => [
                'title' => $this->getConfigItem('seo.title', 'All Stars Battle International 2026'),
                'description' => $this->getConfigItem('seo.description', 'La plus grande compétition de danse urbaine en Afrique.'),
                'keywords' => $this->getConfigItem('seo.keywords', 'danse, battle, hip-hop, breaking, togo, lomé'),
            ],
            'hero' => [
                'title' => $this->getConfigItem('hero.title', 'ALL STARS BATTLE INTERNATIONAL'),
                'subtitle' => $this->getConfigItem('hero.subtitle', 'Le Trône. Le Respect. La Légende.'),
                'location' => $this->getConfigItem('hero.location', 'TOGO 2026'),
                'backgroundImage' => $this->getConfigItem('hero.backgroundImage', 'https://images.unsplash.com/photo-1547153760-18fc86324498'),
                'videoUrl' => $this->getConfigItem('hero.videoUrl', 'https://vjs.zencdn.net/v/oceans.mp4'),
            ],
            'competition' => [
                'dateStart' => $this->getConfigItem('competition.dateStart', '14 - 16 AOÛT 2026'),
                'location' => $this->getConfigItem('competition.location', 'PALAIS DES CONGRÈS DE LOMÉ, TOGO'),
                'description' => $this->getConfigItem('competition.description', 'L\'élite mondiale du breaking et du hip-hop...'),
            ],
            'dancers' => ['sectionTitle' => $this->getConfigItem('dancers.sectionTitle', 'LES LÉGENDES VIVANTES'), 'sectionSubtitle' => $this->getConfigItem('dancers.sectionSubtitle', 'Découvrez les meilleurs danseurs du continent')],
            'programmation' => ['sectionTitle' => $this->getConfigItem('programmation.sectionTitle', 'CALENDRIER')],
            'vip' => [
                'sectionTitle' => $this->getConfigItem('vip.sectionTitle', 'EXPÉRIENCE VIP'),
                'sectionDescription' => $this->getConfigItem('vip.sectionDescription', 'Vivez l\'événement de façon exceptionnelle'),
                'features' => $this->getConfigItem('vip.features', []),
            ],
            'stats' => $this->getConfigItem('stats', []),
            'partners' => ['sectionTitle' => $this->getConfigItem('partners.sectionTitle', 'NOS PARTENAIRES')],
            'blog' => ['sectionTitle' => $this->getConfigItem('blog.sectionTitle', 'ACTUALITÉS')],
            'footer' => [
                'description' => $this->getConfigItem('footer.description', 'All Stars Battle International'),
                'copyright' => $this->getConfigItem('footer.copyright', '© 2026 ASBI. Tous droits réservés.'),
            ],
            'homepageStats' => $this->getConfigItem('stats', []),
            'eventDate' => $this->getConfigItem('eventDate', '2026-08-14'),
        ];
    }

    private function getTheme()
    {
        return $this->getConfigItem('theme', [
            'primary' => '#d35f17',
            'accent' => '#f4d125',
            'accentRed' => '#dc2626',
            'background' => '#0a0807',
            'surface' => '#1a1a1a',
            'text' => '#ffffff',
            'mutedText' => '#94a3b8',
        ]);
    }

    private function getPageBackgrounds()
    {
        return $this->getConfigItem('pageBackgrounds', [
            'hero' => [
                'imageUrl' => 'https://images.unsplash.com/photo-1547153760-18fc86324498',
                'videoUrl' => 'https://vjs.zencdn.net/v/oceans.mp4',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
            'artisticScene' => [
                'imageUrl' => 'https://i.ibb.co/LhsB2zPT/20260319-190925.jpg',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
            'dancers' => [
                'imageUrl' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
            'media' => [
                'imageUrl' => 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
            'contact' => [
                'imageUrl' => 'https://images.unsplash.com/photo-1552664730-d307ca884978',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
            'competition' => [
                'imageUrl' => 'https://picsum.photos/seed/dance/800/450',
                'width' => 800,
                'height' => 450,
                'lastModified' => now()->toIso8601String(),
            ],
            'vip' => [
                'imageUrl' => 'https://picsum.photos/seed/viplounge/600/400',
                'width' => 600,
                'height' => 400,
                'lastModified' => now()->toIso8601String(),
            ],
            'participate' => [
                'imageUrl' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=60&w=1920',
                'width' => 1920,
                'height' => 1080,
                'lastModified' => now()->toIso8601String(),
            ],
        ]);
    }

    private function getSiteAssets()
    {
        $logo = $this->getConfigItem('siteAssets.logo', [
            'url' => '',
            'alt' => 'All Stars Battle International Logo',
            'lastModified' => ''
        ]);

        return [
            'backgrounds' => [],
            'illustrations' => [],
            'videos' => [],
            'logo' => $logo
        ];
    }

    private function getParticipate()
    {
        return $this->getConfigItem('participate', [
            'hero' => [
                'title' => 'REJOIGNEZ',
                'titleHighlight' => 'L\'AVENTURE',
                'subtitle' => 'Soyez partie prenante du plus grand événement urbain d\'Afrique',
            ],
            'sections' => [
                'dancers' => ['title' => 'Danseurs', 'description' => 'Proposez votre candidature'],
                'professionals' => ['title' => 'Professionnels', 'description' => 'DJ, MC, Photographes...'],
                'volunteers' => ['title' => 'Bénévoles', 'description' => 'Aidez-nous à créer l\'événement'],
            ],
            'formFields' => [
                'nameLabel' => 'Nom complet',
                'emailLabel' => 'Email',
                'phoneLabel' => 'Téléphone',
                'countryLabel' => 'Pays',
                'messageLabel' => 'Message',
            ],
            'successMessage' => [
                'title' => 'Merci pour votre candidature!',
                'subtitle' => 'Nous reviendrons vers vous rapidement.',
            ],
        ]);
    }

    private function getOrganizers()
    {
        return Organizer::all()->map(fn($o) => [
            'id' => (string)$o->id,
            'name' => $o->name,
            'role' => $o->role,
            'bio' => $o->bio,
            'photo' => $o->photo,
            'socialLinks' => json_decode($o->social_links, true) ?? [],
        ])->toArray();
    }

    private function getOrganizersConfig()
    {
        return [
            'sectionTitle' => $this->getConfigItem('organizers.sectionTitle', 'L\'EQUIPE ORGANISATION'),
            'sectionDescription' => $this->getConfigItem('organizers.sectionDescription', 'Derrière le plus grand événement de breaking d\'Afrique de l\'Ouest...'),
            'organizationName' => $this->getConfigItem('organizers.organizationName', 'ASBI Togo 2026'),
        ];
    }

    // Endpoints for managing participants
    public function storeParticipant(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'country' => 'required|string',
            'category' => 'required|in:b-boy,b-girl,crew,judge,dj,mc',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'photo' => 'nullable|string',
            'countryCode' => 'nullable|string',
        ]);

        try {
            $participant = Participant::create([
                'name' => $validated['name'],
                'country' => $validated['country'],
                'category' => $validated['category'],
                'specialty' => $validated['specialty'] ?? '',
                'bio' => $validated['bio'] ?? '',
                'photo' => $validated['photo'] ?? '',
                'country_code' => $validated['countryCode'] ?? '',
            ]);

            return response()->json($participant, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateParticipant(\Illuminate\Http\Request $request, $id)
    {
        try {
            $participant = Participant::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string',
                'country' => 'sometimes|string',
                'category' => 'sometimes|in:b-boy,b-girl,crew,judge,dj,mc',
                'specialty' => 'nullable|string',
                'bio' => 'nullable|string',
                'photo' => 'nullable|string',
                'countryCode' => 'nullable|string',
            ]);

            $updateData = [];
            if (isset($validated['name'])) $updateData['name'] = $validated['name'];
            if (isset($validated['country'])) $updateData['country'] = $validated['country'];
            if (isset($validated['category'])) $updateData['category'] = $validated['category'];
            if (isset($validated['specialty'])) $updateData['specialty'] = $validated['specialty'];
            if (isset($validated['bio'])) $updateData['bio'] = $validated['bio'];
            if (isset($validated['photo'])) $updateData['photo'] = $validated['photo'];
            if (isset($validated['countryCode'])) $updateData['country_code'] = $validated['countryCode'];

            $participant->update($updateData);

            return response()->json($participant);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyParticipant($id)
    {
        try {
            $participant = Participant::findOrFail($id);
            
            // Supprimer l'image de R2 si elle existe
            if ($participant->photo) {
                UploadController::deleteFromR2($participant->photo);
            }
            
            $participant->delete();

            return response()->json(['message' => 'Participant deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Blog/Articles management
    public function storeArticle(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|string',
            'coverImage' => 'nullable|string',
            'tag' => 'nullable|string',
        ]);

        try {
            $article = Article::create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'category' => $validated['category'],
                'cover_image' => $validated['coverImage'] ?? '',
                'tag' => $validated['tag'] ?? 'EVENT',
                'date' => now()->format('Y-m-d'),
            ]);

            return response()->json($article, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateArticle(\Illuminate\Http\Request $request, $id)
    {
        try {
            $article = Article::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string',
                'content' => 'sometimes|string',
                'category' => 'sometimes|string',
                'coverImage' => 'nullable|string',
                'tag' => 'nullable|string',
            ]);

            $updateData = [];
            if (isset($validated['title'])) $updateData['title'] = $validated['title'];
            if (isset($validated['content'])) $updateData['content'] = $validated['content'];
            if (isset($validated['category'])) $updateData['category'] = $validated['category'];
            if (isset($validated['coverImage'])) $updateData['cover_image'] = $validated['coverImage'];
            if (isset($validated['tag'])) $updateData['tag'] = $validated['tag'];

            $article->update($updateData);

            return response()->json($article);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyArticle($id)
    {
        try {
            $article = Article::findOrFail($id);
            
            // Supprimer l'image de couverture de R2 si elle existe
            if ($article->cover_image) {
                UploadController::deleteFromR2($article->cover_image);
            }
            
            $article->delete();

            return response()->json(['message' => 'Article deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Ticketing management
    public function storeTicket(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|string',
            'period' => 'nullable|string',
            'tag' => 'nullable|string',
            'features' => 'nullable|array',
            'buttonText' => 'nullable|string',
            'color' => 'nullable|string',
            'recommended' => 'nullable|boolean',
            'paymentLink' => 'nullable|string',
        ]);

        try {
            $ticket = Ticket::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'period' => $validated['period'] ?? 'Par jour',
                'tag' => $validated['tag'] ?? 'Standard',
                'benefits' => json_encode($validated['features'] ?? []),
                'button_text' => $validated['buttonText'] ?? 'Réserver',
                'color' => $validated['color'] ?? 'primary',
                'recommended' => $validated['recommended'] ?? false,
                'payment_link' => $validated['paymentLink'] ?? '#',
            ]);

            return response()->json($ticket, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateTicket(\Illuminate\Http\Request $request, $id)
    {
        try {
            $ticket = Ticket::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string',
                'price' => 'sometimes|string',
                'period' => 'nullable|string',
                'tag' => 'nullable|string',
                'features' => 'nullable|array',
                'buttonText' => 'nullable|string',
                'color' => 'nullable|string',
                'recommended' => 'nullable|boolean',
                'paymentLink' => 'nullable|string',
            ]);

            $updateData = [];
            if (isset($validated['name'])) $updateData['name'] = $validated['name'];
            if (isset($validated['price'])) $updateData['price'] = $validated['price'];
            if (isset($validated['period'])) $updateData['period'] = $validated['period'];
            if (isset($validated['tag'])) $updateData['tag'] = $validated['tag'];
            if (isset($validated['features'])) $updateData['benefits'] = json_encode($validated['features']);
            if (isset($validated['buttonText'])) $updateData['button_text'] = $validated['buttonText'];
            if (isset($validated['color'])) $updateData['color'] = $validated['color'];
            if (isset($validated['recommended'])) $updateData['recommended'] = $validated['recommended'];
            if (isset($validated['paymentLink'])) $updateData['payment_link'] = $validated['paymentLink'];

            $ticket->update($updateData);

            return response()->json($ticket);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyTicket($id)
    {
        try {
            $ticket = Ticket::findOrFail($id);
            $ticket->delete();

            return response()->json(['message' => 'Ticket deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // FAQ management
    public function storeFAQ(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        try {
            $faq = FAQ::create([
                'question' => $validated['question'],
                'answer' => $validated['answer'],
            ]);

            return response()->json($faq, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateFAQ(\Illuminate\Http\Request $request, $id)
    {
        try {
            $faq = FAQ::findOrFail($id);

            $validated = $request->validate([
                'question' => 'sometimes|string',
                'answer' => 'sometimes|string',
            ]);

            $updateData = [];
            if (isset($validated['question'])) $updateData['question'] = $validated['question'];
            if (isset($validated['answer'])) $updateData['answer'] = $validated['answer'];

            $faq->update($updateData);

            return response()->json($faq);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyFAQ($id)
    {
        try {
            $faq = FAQ::findOrFail($id);
            $faq->delete();

            return response()->json(['message' => 'FAQ deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Program management
    public function storeProgramDay(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'label' => 'required|string',
        ]);

        try {
            $programDay = ProgramDay::create([
                'date' => $validated['date'],
                'label' => $validated['label'],
            ]);

            return response()->json($programDay, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateProgramDay(\Illuminate\Http\Request $request, $id)
    {
        try {
            $programDay = ProgramDay::findOrFail($id);

            $validated = $request->validate([
                'date' => 'sometimes|date',
                'label' => 'sometimes|string',
            ]);

            $updateData = [];
            if (isset($validated['date'])) $updateData['date'] = $validated['date'];
            if (isset($validated['label'])) $updateData['label'] = $validated['label'];

            $programDay->update($updateData);

            return response()->json($programDay);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyProgramDay($id)
    {
        try {
            $programDay = ProgramDay::findOrFail($id);
            $programDay->delete();

            return response()->json(['message' => 'Program day deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeActivity(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'programDayId' => 'required|integer|exists:program_days,id',
            'time' => 'required|string',
            'title' => 'required|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        try {
            $activity = Activity::create([
                'program_day_id' => $validated['programDayId'],
                'time' => $validated['time'],
                'title' => $validated['title'],
                'location' => $validated['location'] ?? '',
                'description' => $validated['description'] ?? '',
                'category' => $validated['category'] ?? 'General',
            ]);

            return response()->json($activity, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateActivity(\Illuminate\Http\Request $request, $id)
    {
        try {
            $activity = Activity::findOrFail($id);

            $validated = $request->validate([
                'time' => 'sometimes|string',
                'title' => 'sometimes|string',
                'location' => 'nullable|string',
                'description' => 'nullable|string',
                'category' => 'nullable|string',
            ]);

            $updateData = [];
            if (isset($validated['time'])) $updateData['time'] = $validated['time'];
            if (isset($validated['title'])) $updateData['title'] = $validated['title'];
            if (isset($validated['location'])) $updateData['location'] = $validated['location'];
            if (isset($validated['description'])) $updateData['description'] = $validated['description'];
            if (isset($validated['category'])) $updateData['category'] = $validated['category'];

            $activity->update($updateData);

            return response()->json($activity);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyActivity($id)
    {
        try {
            $activity = Activity::findOrFail($id);
            $activity->delete();

            return response()->json(['message' => 'Activity deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeCategory(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            // Get current categories from config or database
            $currentCategories = $this->getCategories();
            
            if (in_array($validated['name'], $currentCategories)) {
                return response()->json(['error' => 'Category already exists'], 400);
            }

            // For now, we'll store categories in a simple JSON file or config
            // In a production app, you'd want a proper categories table
            $categoriesFile = storage_path('app/categories.json');
            
            if (!file_exists($categoriesFile)) {
                $currentCategories = ['Competition', 'Workshop', 'Show', 'Talk', 'Social'];
            }
            
            $currentCategories[] = $validated['name'];
            file_put_contents($categoriesFile, json_encode($currentCategories));

            return response()->json(['message' => 'Category created successfully', 'category' => $validated['name']], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyCategory($name)
    {
        try {
            $categoriesFile = storage_path('app/categories.json');
            
            if (!file_exists($categoriesFile)) {
                $currentCategories = ['Competition', 'Workshop', 'Show', 'Talk', 'Social'];
            } else {
                $currentCategories = json_decode(file_get_contents($categoriesFile), true) ?: ['Competition', 'Workshop', 'Show', 'Talk', 'Social'];
            }

            $currentCategories = array_filter($currentCategories, function($category) use ($name) {
                return $category !== $name;
            });

            file_put_contents($categoriesFile, json_encode(array_values($currentCategories)));

            return response()->json(['message' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getCategories()
    {
        $categoriesFile = storage_path('app/categories.json');
        
        if (file_exists($categoriesFile)) {
            return json_decode(file_get_contents($categoriesFile), true) ?: ['Competition', 'Workshop', 'Show', 'Talk', 'Social'];
        }
        
        return ['Competition', 'Workshop', 'Show', 'Talk', 'Social'];
    }

    // Contact Messages management
    public function getContactMessages()
    {
        return ContactMessage::orderBy('created_at', 'desc')->get()->map(fn($message) => [
            'id' => (string)$message->id,
            'name' => $message->name,
            'email' => $message->email,
            'subject' => $message->subject,
            'message' => $message->message,
            'status' => $message->status,
            'source' => $message->source ?? 'website',
            'read_at' => $message->read_at,
            'created_at' => $message->created_at,
            'updated_at' => $message->updated_at,
        ])->toArray();
    }

    public function storeContactMessage(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'source' => 'nullable|in:website,danseurs,professionnels,benevoles,sponsors,admin',
        ]);

        try {
            $contactMessage = ContactMessage::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'] ?? null,
                'message' => $validated['message'],
                'source' => $validated['source'] ?? 'website',
            ]);

            return response()->json($contactMessage, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markContactMessageAsRead($id)
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->markAsRead();

            return response()->json(['message' => 'Message marked as read']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markContactMessageAsReplied($id)
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->markAsReplied();

            return response()->json(['message' => 'Message marked as replied']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function replyContactMessage(\Illuminate\Http\Request $request, $id)
    {
        \Log::info('Reply request received', ['id' => $id, 'payload' => $request->all()]);

        $validated = $request->validate([
            'reply_message' => 'required|string',
            'reply_subject' => 'nullable|string|max:255',
        ]);

        try {
            $message = ContactMessage::findOrFail($id);
            \Log::info('Contact message found for reply', ['message' => $message->toArray()]);

            Mail::to($message->email)->send(new ContactMessageReplyMail($message, $validated['reply_message'], $validated['reply_subject'] ?? null));
            \Log::info('Mail sent to contact', ['email' => $message->email]);

            $message->markAsReplied();

            return response()->json(['message' => 'Reply sent successfully']);
        } catch (\Exception $e) {
            \Log::error('Error replying to contact message', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function sendAdminMessage(\Illuminate\Http\Request $request)
    {
        \Log::info('Send admin message request', ['payload' => $request->all()]);

        $validated = $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'name' => 'nullable|string|max:100',
            'source' => 'nullable|in:website,danseurs,professionnels,benevoles,sponsors,admin',
        ]);

        try {
            Mail::to($validated['email'])->send(new \App\Mail\AdminContactMessageMail(
                $validated['subject'],
                $validated['message'],
                $validated['name'] ?? null
            ));

            // Enregistrer aussi en base pour traçabilité côté admin dans le dashboard
            ContactMessage::create([
                'name' => $validated['name'] ?? 'Admin Message',
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'replied',
                'source' => 'admin',
            ]);

            return response()->json(['message' => 'Email envoyé avec succès']);
        } catch (\Exception $e) {
            \Log::error('Error sending admin message', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyContactMessage($id)
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->delete();

            return response()->json(['message' => 'Contact message deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

