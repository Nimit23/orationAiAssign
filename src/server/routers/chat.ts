import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAIChatCompletion } from '../services/ai';

export const chatRouter = router({
  getSessions: publicProcedure.query(() => {
    return prisma.chatSession.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),
  getMessages: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => {
      return prisma.message.findMany({
        where: {
          chatSessionId: input.sessionId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),
  createSession: publicProcedure.mutation(() => {
    return prisma.chatSession.create({
      data: {},
    });
  }),
  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.number(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.message.create({
        data: {
          chatSessionId: input.sessionId,
          content: input.content,
          role: 'USER',
        },
      });

      const messages = await prisma.message.findMany({
        where: {
          chatSessionId: input.sessionId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const aiResponse = await getAIChatCompletion(messages);

      await prisma.message.create({
        data: {
          chatSessionId: input.sessionId,
          content: aiResponse,
          role: 'AI',
        },
      });
    }),
});
