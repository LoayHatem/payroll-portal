import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/salary-adjustments', async (req, res) => {
  const { name, description, type, value, formula, variables } = req.body;

  try {
    const salaryAdjustment = await prisma.salaryAdjustment.create({
      data: {
        name,
        description,
        type,
        value,
        formula,
        variables: JSON.stringify(variables),
      },
    });
    res.json(salaryAdjustment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating salary adjustment' });
  }
});

// Add other CRUD operations as needed

export default router;