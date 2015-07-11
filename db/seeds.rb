require 'dotenv'
require 'wordnik'

# Word.delete_all

def parts_of_speech
  pos = ["noun",
        "adjective",
        "verb",
        "adverb",
        "interjection",
        "pronoun",
        "preposition",
        "abbreviation",
        "affix",
        "article",
        "auxilliary-verb",
        "conjunction",
        "definite-article",
        "family-name",
        "given-name",
        "idiom",
        "imperative",
        "noun-plural",
        "noun-possessive",
        "past-participle",
        "phrasal-prefix",
        "proper-noun",
        "proper-noun-plural",
        "proper-noun-possessive",
        "suffic",
        "verb-intransitive",
        "verb-transitive"]
end

def articles
  articles = [{"word" => "a"},{"word"=> "an"},{"word" => "the"}]
end

def get_random_words(word_type, dictionary_def, frequency, quantity)

  Wordnik.configure do |config|
      config.api_key = "#{ENV["API_KEY"]}"
  end

  types_to_exclude = parts_of_speech
  types_to_exclude.delete(word_type)

  word_list = Wordnik.words.get_random_words(
              :has_dictionary_def => "#{dictionary_def}",
              :include_part_of_speech => "#{word_type}",
              :exclue_part_of_speech => types_to_exclude,
              :min_corpus_count => "#{frequency}",
              :limit => "#{quantity}"
  )

end

def get_word_lists
  nouns = get_random_words("noun", true, 7000, 800)
  populate_database(nouns, "noun", false)
  verbs = get_random_words("verb", true, 7000, 800)
  populate_database(verbs, "verb", false)
  adjectives = get_random_words("adjective", true, 7000, 800)
  populate_database(adjectives, "adjective", false)
  less_common_nouns = get_random_words("noun", true, 3000, 400)
  populate_database(less_common_nouns, "noun", false)
  less_common_verbs = get_random_words("verb", true, 3000, 400)
  populate_database(less_common_verbs, "verb", false)
  prepositions = get_random_words("preposition", true, 1, 30)
  populate_database(prepositions, "preposition", false)
  populate_database(articles, "article", false)

  # flarf
  idioms = get_random_words("idiom", false, 1000, 500)
  populate_database(idioms, "noun", true)
  weird_verbs = get_random_words("verb", false, 500, 500)
  populate_database(weird_verbs, "verb", true)
  weird_nouns = get_random_words("noun", false, 500, 500)
  populate_database(weird_nouns, "noun", true)
  weird_adjectives = get_random_words("adjective", false, 500, 500)
  populate_database(weird_adjectives, "adjective", true)
 end

def populate_database(collection, part_of_speech, flarf_flag)
  new_words_array = []
  collection.each do |item|
    word_hash = {}
    word_hash[:word] = item["word"]
    word_hash[:part_of_speech] = part_of_speech
    word_hash[:flarf] = flarf_flag
    new_words_array << word_hash
  end
  new_words_array.each do |word|
    Word.create(word)
  end
end

get_word_lists
