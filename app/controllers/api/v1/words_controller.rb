module API
  module V1
    class WordsController < ApplicationController
      def index
        number_of_possible_choices = Word.where("part_of_speech = ? AND flarf = ?", params["part_of_speech"], params["flarf"] ).count
        id_no = rand(1..number_of_possible_choices)
        @word = Word.where("part_of_speech = ? AND flarf = ?", params["part_of_speech"], params["flarf"]).offset(id_no-1).limit(1)
        render json: @word
      end
    end
  end
end