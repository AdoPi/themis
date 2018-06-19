require "application_system_test_case"

class UserScoresTest < ApplicationSystemTestCase
  setup do
    @user_score = user_scores(:one)
  end

  test "visiting the index" do
    visit user_scores_url
    assert_selector "h1", text: "User Scores"
  end

  test "creating a User score" do
    visit user_scores_url
    click_on "New User Score"

    fill_in "Leaderboard", with: @user_score.leaderboard_id
    fill_in "Points", with: @user_score.points
    fill_in "User Name", with: @user_score.user_name
    click_on "Create User score"

    assert_text "User score was successfully created"
    click_on "Back"
  end

  test "updating a User score" do
    visit user_scores_url
    click_on "Edit", match: :first

    fill_in "Leaderboard", with: @user_score.leaderboard_id
    fill_in "Points", with: @user_score.points
    fill_in "User Name", with: @user_score.user_name
    click_on "Update User score"

    assert_text "User score was successfully updated"
    click_on "Back"
  end

  test "destroying a User score" do
    visit user_scores_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "User score was successfully destroyed"
  end
end
