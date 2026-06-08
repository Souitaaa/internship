import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';

@Controller('machines')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  @Post(':id/energy')
  updateEnergy(@Param('id') id: string, @Body() body: { energy: number, name: string, uid: string }) {
    if (body.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert({
        id,
        name: body.name,
        uid: body.uid,
        energy: body.energy,
      });
    }
    return { success: true };
  }

  @Post('event')
  handleMachineEvent(@Body() body: { type: string, message: string, machine?: any }) {
    this.notificationsGateway.sendNotification(body);
    // Additionally, if it's an add/edit event, check energy limit as well
    if ((body.type === 'Add' || body.type === 'Edit') && body.machine && body.machine.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert(body.machine);
    }
    return { success: true };
  }
}
