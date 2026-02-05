"""
Mock database implementation for development without MongoDB
"""
from typing import Dict, List, Optional
import json
from datetime import datetime

class MockDatabase:
    def __init__(self):
        self.users: List[Dict] = []
        self.prompts: List[Dict] = []
        self.status_checks: List[Dict] = []
    
    def find_user_by_email(self, email: str) -> Optional[Dict]:
        for user in self.users:
            if user.get('email') == email:
                return user
        return None
    
    def find_user_by_id(self, user_id: str) -> Optional[Dict]:
        for user in self.users:
            if user.get('id') == user_id:
                return user
        return None
    
    def insert_user(self, user_data: Dict) -> Dict:
        self.users.append(user_data)
        return user_data
    
    def find_prompts_by_user_id(self, user_id: str) -> List[Dict]:
        return [prompt for prompt in self.prompts if prompt.get('user_id') == user_id]
    
    def insert_prompt(self, prompt_data: Dict) -> Dict:
        self.prompts.append(prompt_data)
        return prompt_data
    
    def insert_status_check(self, status_data: Dict) -> Dict:
        self.status_checks.append(status_data)
        return status_data
    
    def get_all_status_checks(self) -> List[Dict]:
        return self.status_checks

# Global mock database instance
mock_db = MockDatabase()