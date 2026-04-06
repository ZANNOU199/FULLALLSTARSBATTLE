<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\URL;

class SitemapController extends Controller
{
    /**
     * Generate sitemap.xml for Google SEO
     * Lists all pages and blog articles for indexing
     */
    public function index()
    {
        $pages = [
            [
                'url' => '/',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => 1.0
            ],
            [
                'url' => '/competition',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.9
            ],
            [
                'url' => '/dancers',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.9
            ],
            [
                'url' => '/judges',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => 0.8
            ],
            [
                'url' => '/history',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => 0.8
            ],
            [
                'url' => '/media',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.8
            ],
            [
                'url' => '/tickets',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => 0.9
            ],
            [
                'url' => '/program',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.85
            ],
            [
                'url' => '/news',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => 0.8
            ],
            [
                'url' => '/artistic',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.75
            ],
            [
                'url' => '/contact',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => 0.7
            ],
            [
                'url' => '/partners',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => 0.75
            ],
            [
                'url' => '/participate',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => 0.85
            ],
            [
                'url' => '/faq',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => 0.7
            ],
        ];

        // Add blog articles dynamically
        try {
            $articles = Article::orderBy('created_at', 'desc')->get();
            foreach ($articles as $article) {
                $pages[] = [
                    'url' => "/news?article={$article->id}",
                    'lastmod' => $article->updated_at->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => 0.7
                ];
            }
        } catch (\Exception $e) {
            \Log::error('Error fetching articles for sitemap: ' . $e->getMessage());
        }

        return response()->view('sitemap', ['pages' => $pages], 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}
