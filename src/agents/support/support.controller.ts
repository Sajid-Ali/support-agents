import { Body, Controller, Post } from '@nestjs/common';
import { SupportService } from './support.service.js';
import { ChatDto } from './dto/chat.dto.js';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('chat')
  async chat(@Body() input: ChatDto) {
    console.log("🚀 ~ SupportController ~ chat ~ input:", input)
    return this.supportService.processRequest(input.message);
  }
}
