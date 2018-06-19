require "application_system_test_case"

class LeaderboardsTest < ApplicationSystemTestCase
  setup do
    @leaderboard = leaderboards(:one)
  end

  test "visiting the index" do
    visit leaderboards_url
    assert_selector "h1", text: "Leaderboards"
  end

  test "creating a Leaderboard" do
    visit leaderboards_url
    click_on "New Leaderboard"

    fill_in "Company Name", with: @leaderboard.company_name
    fill_in "Name", with: @leaderboard.name
    click_on "Create Leaderboard"

    assert_text "Leaderboard was successfully created"
    click_on "Back"
  end

  test "updating a Leaderboard" do
    visit leaderboards_url
    click_on "Edit", match: :first

    fill_in "Company Name", with: @leaderboard.company_name
    fill_in "Name", with: @leaderboard.name
    click_on "Update Leaderboard"

    assert_text "Leaderboard was successfully updated"
    click_on "Back"
  end

  test "destroying a Leaderboard" do
    visit leaderboards_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Leaderboard was successfully destroyed"
  end
end
