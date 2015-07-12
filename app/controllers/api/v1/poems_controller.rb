module API
  module V1
    class PoemsController < ApplicationController
      def create
        @poem = Poem.new(title: params[:title], user_id: current_user.id)
        @word_collection = params[:words]
        if @poem.save
          @word_collection.each do |index, values|
            WordLocation.create!(word_id: values[:word_id], poem_id: @poem.id, x_position: values[:top], y_position: values[:left])
          end
          render json: {message: "Poem has been created.", id: @poem.id}, status: 201
        else
          render json: {error: "Poem could not be created."}, status: 422
        end
      end

      def update
        @poem = Poem.find(params[:id])
        if @poem.update(title: params[:title], id: params[:id].to_i)
          unless WordLocation.where(poem_id: @poem.id).empty?
            WordLocation.where(poem_id: @poem.id).delete_all
          end
          @word_collection = params[:words]
          @word_collection.each do |index, values|
            WordLocation.create!(word_id: values[:word_id], poem_id: @poem.id, x_position: values[:top], y_position: values[:left])
          end
          render json: {message: "Poem has been updated.", id: @poem.id}, status: 201
        else
          render json: {message: "The poem could not be saved. Please try again."}, status: 422
        end
      end

      protected

      def poem_params
        params.permit(:title, :id).merge(user_id: current_user.id)
      end

    end
  end
end