class AnalyticsService {
  private readonly isProduction = !__DEV__;

  logEvent(eventName: string, parameters?: Record<string, unknown>) {
    if (!this.isProduction) return;

    console.log('Analytics:', eventName, parameters ?? {});
  }

  logScreenView(screenName: string) {
    this.logEvent('screen_view', { screen_name: screenName });
  }

  logSpeciesView(speciesId: string, speciesName: string) {
    this.logEvent('species_viewed', {
      species_id: speciesId,
      species_name: speciesName,
    });
  }

  logSearch(query: string, results: number) {
    this.logEvent('species_search', {
      search_query: query,
      results_count: results,
    });
  }

  logFavoriteToggle(speciesId: string, isFavorited: boolean) {
    this.logEvent('favorite_toggle', {
      species_id: speciesId,
      action: isFavorited ? 'add' : 'remove',
    });
  }
}

export default new AnalyticsService();
