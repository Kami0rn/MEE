package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	language "cloud.google.com/go/language/apiv1"
	languagepb "cloud.google.com/go/language/apiv1/languagepb"
)

var chatEnabled = true

func main() {
	// Load environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Create the Gin application
	r := gin.Default()
	r.Use(cors.Default())

	// Route for toggling chat enable/disable
	r.POST("/chat_toggle", func(c *gin.Context) {
		var json struct {
			Action string `json:"action"`
		}
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		switch json.Action {
		case "enable":
			chatEnabled = true
			c.JSON(http.StatusOK, gin.H{"message": "Chat enabled"})
		case "disable":
			chatEnabled = false
			c.JSON(http.StatusOK, gin.H{"message": "Chat disabled"})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
		}
	})

	// Route for getting chat status
	r.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"chat_enabled": chatEnabled})
	})

	// Route for the chat endpoint
	r.POST("/chat", func(c *gin.Context) {
		if !chatEnabled {
			c.JSON(http.StatusForbidden, gin.H{"error": "Chat is currently disabled"})
			return
		}

		var json struct {
			UserInput           string `json:"user_input"`
			ConversationHistory string `json:"conversation_history"`
		}
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		if json.UserInput == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No user input provided"})
			return
		}

		// Define the prompt template
		promptTemplate := "From this word '%s' I want you to answer like human talk to person who facing with depression. In term of friend with no judging. using user user_input language as respond language , Answer it with in 80 token"
		prompt := fmt.Sprintf(promptTemplate, json.UserInput)

		// Update conversation history
		if json.ConversationHistory != "" {
			json.ConversationHistory += fmt.Sprintf("\nYou: %s", json.UserInput)
		} else {
			json.ConversationHistory = fmt.Sprintf("You: %s", json.UserInput)
		}

		// Generate a response from the model with the formatted prompt and conversation history
		fullPrompt := fmt.Sprintf("%s\n\n%s", json.ConversationHistory, prompt)

		// Call Google Cloud Natural Language API
		ctx := context.Background()
		client, err := language.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
		if err != nil {
			log.Fatalf("Failed to create natural language service: %v", err)
		}

		req := &languagepb.AnalyzeSentimentRequest{
			Document: &languagepb.Document{
				Type:    languagepb.Document_PLAIN_TEXT,
				Source:  &languagepb.Document_Content{Content: fullPrompt},
				Language: "en",
			},
		}

		resp, err := client.AnalyzeSentiment(ctx, req)
		if err != nil {
			log.Printf("AnalyzeSentiment error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze sentiment", "details": err.Error()})
			return
		}

		// Parse the AI's response (example: using sentiment score as a simple response)
		aiResponse := fmt.Sprintf("Sentiment score: %v", resp.DocumentSentiment.Score)

		// Update conversation history with AI response
		json.ConversationHistory += fmt.Sprintf("\nAI: %s", aiResponse)

		// Return the response and updated conversation history
		c.JSON(http.StatusOK, gin.H{
			"ai_response":          aiResponse,
			"conversation_history": json.ConversationHistory,
		})
	})

	// Run the server
	r.Run("127.0.0.1:5000")
}
