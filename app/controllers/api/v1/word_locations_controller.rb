class WordLocationsController < ApplicationController
  def create
    @word = Word.new(word_params)
  end

  protected

  def word_params
    params.permit(:word_id, :poem_id, :x_position, :y_position)
  end
end